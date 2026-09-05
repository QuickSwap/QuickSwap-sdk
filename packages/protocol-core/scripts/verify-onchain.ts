import { getSupportedChainIds, getChain } from '../src/chains/registry'
import type { ChainConfig, ProtocolDeployment } from '../src/chains/types'

/**
 * Reads every address the registry records and checks it against live chain
 * state: contract code must be present, and the two fields that expose a
 * `factory()` view must name the factory recorded for the same chain.
 *
 * Maintainer tool. Requires network access, so it stays out of the published
 * package and out of automated pipelines. Run it with `pnpm verify:onchain`.
 */

const USER_AGENT = 'quickswap-protocol-core-verify'

/** `factory()` — the role-identifying view shared by the concentrated families. */
const FACTORY_SELECTOR = '0xc45a0155'

const REQUEST_TIMEOUT_MS = 15_000
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const EVM_ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/

/** Fields whose contract names its own factory, so the role can be read back. */
const ROLE_FIELDS: ReadonlyArray<string> = ['quoter', 'positionManager']

const ENDPOINT_TIERS = {
  KEYED: 'keyed',
  PUBLIC: 'public',
} as const

type EndpointTier = (typeof ENDPOINT_TIERS)[keyof typeof ENDPOINT_TIERS]

const BATCH_STATUSES = {
  CHECKED: 'checked',
  VOID: 'void',
  SKIPPED: 'skipped',
} as const

const OUTCOMES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  ROLE_OK: 'role-ok',
  ROLE_SIBLING: 'role-sibling',
  ROLE_MISMATCH: 'role-mismatch',
} as const

type Outcome = (typeof OUTCOMES)[keyof typeof OUTCOMES]

/** Outcomes that make the run fail. Every other outcome is informational. */
const NEGATIVE_OUTCOMES: ReadonlyArray<Outcome> = [OUTCOMES.ABSENT, OUTCOMES.ROLE_MISMATCH]

interface ChainEndpoints {
  readonly drpcSlug?: string
  readonly publicUrl: string
}

/**
 * One entry per chain the registry can carry addresses for. Chains without a
 * `drpcSlug` are reached over their public endpoint only.
 */
const ENDPOINTS: Readonly<Record<number, ChainEndpoints>> = {
  137: { drpcSlug: 'polygon', publicUrl: 'https://polygon-bor-rpc.publicnode.com' },
  196: { drpcSlug: 'xlayer', publicUrl: 'https://rpc.xlayer.tech' },
  169: { drpcSlug: 'manta-pacific', publicUrl: 'https://pacific-rpc.manta.network/http' },
  1868: { drpcSlug: 'soneium', publicUrl: 'https://rpc.soneium.org' },
  5031: { publicUrl: 'https://api.infra.mainnet.somnia.network/' },
  5888: { publicUrl: 'https://evm.mantrachain.io' },
  8453: { drpcSlug: 'base', publicUrl: 'https://mainnet.base.org' },
  13371: { drpcSlug: 'immutable-zkevm', publicUrl: 'https://rpc.immutable.com' },
}

const API_KEY = process.env.DRPC_API_KEY ?? ''

interface Candidate {
  readonly tier: EndpointTier
  readonly url: string
}

interface FieldTarget {
  /** Human-readable slot, e.g. `v3 quoter`. */
  readonly label: string
  /** Bare field name, used to decide which checks apply. */
  readonly field: string
  readonly address: string
  /** Absent for chain-level addresses, which belong to no protocol version. */
  readonly deployment?: ProtocolDeployment
}

interface Finding {
  readonly field: string
  readonly address: string
  readonly codeSize: number
  readonly outcome: Outcome
  readonly returned?: string
}

interface CheckedBatch {
  readonly status: typeof BATCH_STATUSES.CHECKED
  readonly endpointTier: EndpointTier
  readonly findings: ReadonlyArray<Finding>
}

/** Carries no findings: an unusable endpoint says nothing about any address. */
interface VoidBatch {
  readonly status: typeof BATCH_STATUSES.VOID
  readonly endpointTier: EndpointTier
  readonly reason: string
}

interface SkippedBatch {
  readonly status: typeof BATCH_STATUSES.SKIPPED
  readonly reason: string
}

type BatchResult = CheckedBatch | VoidBatch | SkippedBatch

/** The endpoint could not answer. Discards the whole batch. */
class TransportError extends Error {}

/** The contract answered by reverting. A property of the address, not the endpoint. */
class ExecutionError extends Error {}

const EXECUTION_ERROR_RE = /execution reverted|revert|invalid opcode|out of gas|invalid jump/i

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause)
}

interface JsonRpcFailure {
  readonly code?: number
  readonly message?: string
}

interface JsonRpcPayload {
  readonly result?: unknown
  readonly error?: JsonRpcFailure
}

function isJsonRpcPayload(value: unknown): value is JsonRpcPayload {
  return typeof value === 'object' && value !== null
}

async function jsonRpc(
  url: string,
  method: string,
  params: ReadonlyArray<unknown>,
): Promise<string> {
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        // Several providers answer 403 to a runtime's default agent string.
        'user-agent': USER_AGENT,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (cause) {
    throw new TransportError(`${method}: ${describe(cause)}`)
  }

  if (!response.ok) throw new TransportError(`${method}: HTTP ${response.status}`)

  let payload: unknown
  try {
    payload = await response.json()
  } catch (cause) {
    throw new TransportError(`${method}: unreadable body (${describe(cause)})`)
  }

  if (!isJsonRpcPayload(payload)) throw new TransportError(`${method}: unexpected body shape`)

  if (payload.error) {
    const message = payload.error.message ?? 'unspecified error'
    if (EXECUTION_ERROR_RE.test(message)) throw new ExecutionError(message)
    throw new TransportError(`${method}: ${message}`)
  }

  if (typeof payload.result !== 'string') throw new TransportError(`${method}: no result`)

  return payload.result
}

async function codeSizeOf(url: string, address: string): Promise<number> {
  const code = await jsonRpc(url, 'eth_getCode', [address, 'latest'])
  const body = code.startsWith('0x') ? code.slice(2) : code
  return Math.floor(body.length / 2)
}

/** Reads the trailing 20 bytes of a 32-byte ABI word. */
function decodeAddress(word: string): string | undefined {
  const body = word.startsWith('0x') ? word.slice(2) : word
  if (body.length < 64) return undefined
  const candidate = `0x${body.slice(24, 64)}`
  return EVM_ADDRESS_RE.test(candidate) ? candidate : undefined
}

/** The pool deployer, on the families that declare one. */
function poolDeployerOf(deployment: ProtocolDeployment): string | undefined {
  return 'poolDeployer' in deployment ? deployment.poolDeployer : undefined
}

interface RoleReading {
  readonly outcome: Outcome
  readonly returned?: string
}

/**
 * Calls `factory()` and matches the answer against the addresses recorded for
 * the same deployment. `eth_call` answers in lowercase and the registry stores
 * EIP-55 checksummed values, so both sides are lowercased before comparing.
 */
async function readRole(
  url: string,
  address: string,
  deployment: ProtocolDeployment,
): Promise<RoleReading> {
  let word: string
  try {
    word = await jsonRpc(url, 'eth_call', [{ to: address, data: FACTORY_SELECTOR }, 'latest'])
  } catch (cause) {
    if (cause instanceof ExecutionError) return { outcome: OUTCOMES.ROLE_MISMATCH }
    throw cause
  }

  const returned = decodeAddress(word)
  if (returned === undefined || returned === ZERO_ADDRESS) {
    return { outcome: OUTCOMES.ROLE_MISMATCH, returned }
  }

  const normalised = returned.toLowerCase()
  const poolDeployer = poolDeployerOf(deployment)?.toLowerCase()

  if (normalised === deployment.factory.toLowerCase()) {
    return { outcome: OUTCOMES.ROLE_OK, returned }
  }
  if (poolDeployer !== undefined && normalised === poolDeployer) {
    return { outcome: OUTCOMES.ROLE_SIBLING, returned }
  }
  return { outcome: OUTCOMES.ROLE_MISMATCH, returned }
}

async function inspect(url: string, target: FieldTarget): Promise<Finding> {
  const codeSize = await codeSizeOf(url, target.address)
  const base = { field: target.label, address: target.address, codeSize }

  if (codeSize === 0) return { ...base, outcome: OUTCOMES.ABSENT }

  const { deployment } = target
  if (deployment === undefined || !ROLE_FIELDS.includes(target.field)) {
    return { ...base, outcome: OUTCOMES.PRESENT }
  }

  const role = await readRole(url, target.address, deployment)
  return { ...base, ...role }
}

/** Every address a chain records, in the order the registry declares them. */
function addressTargets(chain: ChainConfig): ReadonlyArray<FieldTarget> {
  const targets: FieldTarget[] = []

  for (const deployment of chain.deployments ?? []) {
    for (const [field, value] of Object.entries(deployment)) {
      if (typeof value !== 'string' || !EVM_ADDRESS_RE.test(value)) continue
      targets.push({
        label: `${deployment.version} ${field}`,
        field,
        address: value,
        deployment,
      })
    }
  }

  if (chain.multicall !== undefined) {
    targets.push({ label: 'multicall', field: 'multicall', address: chain.multicall })
  }

  return targets
}

function candidatesFor(endpoints: ChainEndpoints): ReadonlyArray<Candidate> {
  const candidates: Candidate[] = []
  if (API_KEY !== '' && endpoints.drpcSlug !== undefined) {
    candidates.push({
      tier: ENDPOINT_TIERS.KEYED,
      url: `https://lb.drpc.org/ogrpc?network=${endpoints.drpcSlug}&dkey=${API_KEY}`,
    })
  }
  candidates.push({ tier: ENDPOINT_TIERS.PUBLIC, url: endpoints.publicUrl })
  return candidates
}

/** Confirms the endpoint reports code for an address known to hold some. */
async function requireControl(url: string, address: string): Promise<void> {
  const codeSize = await codeSizeOf(url, address)
  if (codeSize === 0) throw new TransportError(`control ${address} reported no code`)
}

/**
 * Runs one chain against one endpoint. The chain's wrapped native token is the
 * control: it is read before and after the sweep, and either read failing
 * discards the batch, so a run that observed nothing reports `void` rather than
 * a list of absent addresses.
 */
async function runCandidate(
  chain: ChainConfig,
  candidate: Candidate,
  targets: ReadonlyArray<FieldTarget>,
): Promise<CheckedBatch | VoidBatch> {
  const control = chain.wrappedNative.address
  try {
    await requireControl(candidate.url, control)

    const findings: Finding[] = []
    for (const target of targets) {
      findings.push(await inspect(candidate.url, target))
    }

    await requireControl(candidate.url, control)

    return { status: BATCH_STATUSES.CHECKED, endpointTier: candidate.tier, findings }
  } catch (cause) {
    if (cause instanceof TransportError) {
      return { status: BATCH_STATUSES.VOID, endpointTier: candidate.tier, reason: cause.message }
    }
    throw cause
  }
}

async function verifyChain(chain: ChainConfig): Promise<BatchResult> {
  const targets = addressTargets(chain)
  if (targets.length === 0) {
    return { status: BATCH_STATUSES.SKIPPED, reason: 'records no addresses' }
  }

  const endpoints = ENDPOINTS[chain.chainId]
  if (endpoints === undefined) {
    return { status: BATCH_STATUSES.SKIPPED, reason: 'no endpoint recorded for this chain' }
  }

  let lastVoid: VoidBatch | undefined
  for (const candidate of candidatesFor(endpoints)) {
    const result = await runCandidate(chain, candidate, targets)
    if (result.status === BATCH_STATUSES.CHECKED) return result
    lastVoid = result
  }

  return (
    lastVoid ?? {
      status: BATCH_STATUSES.VOID,
      endpointTier: ENDPOINT_TIERS.PUBLIC,
      reason: 'no endpoint candidate available',
    }
  )
}

function formatFinding(finding: Finding): string {
  const slot = finding.field.padEnd(22)
  const size = `${finding.codeSize} bytes`.padStart(12)
  const returned = finding.returned === undefined ? '' : `  → ${finding.returned}`
  return `    ${slot} ${finding.address}  ${finding.outcome.padEnd(14)}${size}${returned}`
}

function report(chain: ChainConfig, result: BatchResult): void {
  const heading = `${chain.name} (${chain.chainId})`

  switch (result.status) {
    case BATCH_STATUSES.CHECKED:
      console.log(`\n${heading} — checked over its ${result.endpointTier} endpoint`)
      result.findings.forEach((finding) => console.log(formatFinding(finding)))
      return
    case BATCH_STATUSES.VOID:
      console.log(`\n${heading} — VOID over its ${result.endpointTier} endpoint`)
      console.log(`    no claim made about any address: ${result.reason}`)
      return
    case BATCH_STATUSES.SKIPPED:
      console.log(`\n${heading} — skipped: ${result.reason}`)
      return
  }
}

function negativesIn(result: BatchResult): ReadonlyArray<Finding> {
  if (result.status !== BATCH_STATUSES.CHECKED) return []
  return result.findings.filter((finding) => NEGATIVE_OUTCOMES.includes(finding.outcome))
}

async function main(): Promise<number> {
  const tier = API_KEY === '' ? 'public endpoints only' : 'keyed endpoints where recorded'
  console.log(`On-chain verification — ${tier}`)

  const counts = { checked: 0, void: 0, skipped: 0 }
  const negatives: Array<{ chain: string; finding: Finding }> = []

  for (const chainId of getSupportedChainIds()) {
    const chain = getChain(chainId)
    if (chain === undefined) continue

    const result = await verifyChain(chain)
    report(chain, result)

    counts[result.status] += 1
    negativesIn(result).forEach((finding) => negatives.push({ chain: chain.name, finding }))
  }

  console.log(
    `\n${counts.checked} checked, ${counts.void} void, ${counts.skipped} skipped` +
      ` — ${negatives.length} negative finding(s)`,
  )

  if (negatives.length > 0) {
    console.log('')
    negatives.forEach(({ chain, finding }) => {
      console.log(`  • ${chain} ${finding.field}: ${finding.outcome} (${finding.address})`)
    })
  }

  return negatives.length > 0 ? 1 : 0
}

main()
  .then((code) => {
    process.exit(code)
  })
  .catch((cause: unknown) => {
    console.error(`\nVerification could not run: ${describe(cause)}`)
    process.exit(1)
  })
