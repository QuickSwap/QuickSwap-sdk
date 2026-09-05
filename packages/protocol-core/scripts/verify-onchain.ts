import { getChainOrThrow, getSupportedChainIds } from '../src/chains/registry'
import type { ChainConfig, ProtocolDeployment } from '../src/chains/types'
import { collectTargets } from '../src/verification/addresses'
import { exitCodeFor, firstCheckedBatch, negativesIn, runBatch } from '../src/verification/batch'
import { BATCH_STATUSES, ENDPOINT_TIERS, EXIT_CODES, OUTCOMES } from '../src/verification/model'
import type {
  AddressTarget,
  BatchResult,
  EndpointTier,
  ExitCode,
  Finding,
  MalformedAddress,
  RoleReading,
} from '../src/verification/model'
import {
  FACTORY_SELECTOR,
  ROLE_FIELDS,
  classifyRoleAnswer,
  isRevertMessage,
} from '../src/verification/roles'
import { sanitiseReason } from '../src/verification/text'

/**
 * Reads every address the registry records and checks it against live chain
 * state: contract code must be present, and the two fields that expose a
 * `factory()` view must name the factory recorded for the same chain.
 *
 * Maintainer tool. Requires network access. Run it with `pnpm verify:onchain`.
 */

const USER_AGENT = 'quickswap-protocol-core-verify'

/** `decimals()` — the ERC-20 view every wrapped native token answers. */
const DECIMALS_SELECTOR = '0x313ce567'

/** One 32-byte ABI word, the shape a control call must answer with. */
const ABI_WORD_RE = /^0x[0-9a-fA-F]{64}$/

const REQUEST_TIMEOUT_MS = 15_000

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

/** The endpoint could not answer. Discards the whole batch. */
class TransportError extends Error {}

/** The call did not execute. A property of the call, not of the endpoint. */
class ExecutionError extends Error {}

function describe(cause: unknown): string {
  return sanitiseReason(cause instanceof Error ? cause.message : String(cause), API_KEY)
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
    const message = sanitiseReason(payload.error.message ?? 'unspecified error', API_KEY)
    throw new TransportError(`${method}: ${message}`)
  }

  if (typeof payload.result !== 'string') throw new TransportError(`${method}: no result`)

  return payload.result
}

/**
 * `eth_call` is the one method whose failure can belong to the contract rather
 * than to the endpoint, so it is the only method whose errors are re-classified.
 */
async function ethCall(url: string, to: string, data: string): Promise<string> {
  try {
    return await jsonRpc(url, 'eth_call', [{ to, data }, 'latest'])
  } catch (cause) {
    if (cause instanceof TransportError && isRevertMessage(cause.message)) {
      throw new ExecutionError(cause.message)
    }
    throw cause
  }
}

async function codeSizeOf(url: string, address: string): Promise<number> {
  const code = await jsonRpc(url, 'eth_getCode', [address, 'latest'])
  const body = code.startsWith('0x') ? code.slice(2) : code
  return Math.floor(body.length / 2)
}

/** Calls `factory()` and classifies the answer, or its absence. */
async function readRole(
  url: string,
  address: string,
  deployment: ProtocolDeployment,
): Promise<RoleReading> {
  let word: string | undefined
  try {
    word = await ethCall(url, address, FACTORY_SELECTOR)
  } catch (cause) {
    if (!(cause instanceof ExecutionError)) throw cause
    word = undefined
  }
  return classifyRoleAnswer(word, deployment)
}

async function inspect(url: string, target: AddressTarget): Promise<Finding> {
  const codeSize = await codeSizeOf(url, target.address)
  const base = { path: target.path, address: target.address, codeSize }

  if (codeSize === 0) return { ...base, outcome: OUTCOMES.ABSENT }

  const { deployment } = target
  if (deployment === undefined || !ROLE_FIELDS.includes(target.field)) {
    return { ...base, outcome: OUTCOMES.PRESENT }
  }

  const role = await readRole(url, target.address, deployment)
  return { ...base, ...role }
}

function candidatesFor(endpoints: ChainEndpoints): readonly [Candidate, ...Candidate[]] {
  const publicCandidate: Candidate = {
    tier: ENDPOINT_TIERS.PUBLIC,
    url: endpoints.publicUrl,
  }
  if (API_KEY === '' || endpoints.drpcSlug === undefined) return [publicCandidate]

  const network = encodeURIComponent(endpoints.drpcSlug)
  const key = encodeURIComponent(API_KEY)
  return [
    { tier: ENDPOINT_TIERS.KEYED, url: `https://lb.drpc.org/ogrpc?network=${network}&dkey=${key}` },
    publicCandidate,
  ]
}

/**
 * Confirms the endpoint answers, on this connection, every transport the sweep
 * will use: `eth_getCode` must report code for an address known to hold some,
 * and, when role reads are due, `eth_call` must answer with a full ABI word.
 */
async function requireControl(url: string, address: string, withCall: boolean): Promise<void> {
  const codeSize = await codeSizeOf(url, address)
  if (codeSize === 0) throw new TransportError(`control ${address} reported no code`)

  if (!withCall) return

  let word: string
  try {
    word = await ethCall(url, address, DECIMALS_SELECTOR)
  } catch (cause) {
    throw new TransportError(`control ${address} could not be called: ${describe(cause)}`)
  }
  if (!ABI_WORD_RE.test(word)) {
    throw new TransportError(`control ${address} answered no ABI word`)
  }
}

function voidReason(cause: unknown): string | undefined {
  return cause instanceof TransportError ? describe(cause) : undefined
}

async function verifyChain(
  chain: ChainConfig,
  targets: ReadonlyArray<AddressTarget>,
): Promise<BatchResult> {
  if (targets.length === 0) {
    return { status: BATCH_STATUSES.SKIPPED, reason: 'records no addresses' }
  }

  const endpoints = ENDPOINTS[chain.chainId]
  if (endpoints === undefined) {
    return { status: BATCH_STATUSES.SKIPPED, reason: 'no endpoint recorded for this chain' }
  }

  const control = chain.wrappedNative.address
  const readsRoles = targets.some(
    (target) => target.deployment !== undefined && ROLE_FIELDS.includes(target.field),
  )

  return firstCheckedBatch(candidatesFor(endpoints), (candidate) =>
    runBatch(candidate.tier, targets, {
      control: () => requireControl(candidate.url, control, readsRoles),
      inspect: (target) => inspect(candidate.url, target),
      voidReason,
    }),
  )
}

const PATH_COLUMN = 30

function formatFinding(finding: Finding): string {
  const slot = finding.path.padEnd(PATH_COLUMN)
  const size = `${finding.codeSize} bytes`.padStart(12)
  const returned = finding.returned === undefined ? '' : `  → ${finding.returned}`
  return `    ${slot} ${finding.address}  ${finding.outcome.padEnd(14)}${size}${returned}`
}

function report(
  chain: ChainConfig,
  result: BatchResult,
  malformed: ReadonlyArray<MalformedAddress>,
): void {
  const heading = `${chain.name} (${chain.chainId})`

  switch (result.status) {
    case BATCH_STATUSES.CHECKED:
      console.log(`\n${heading} — checked over its ${result.endpointTier} endpoint`)
      result.findings.forEach((finding) => console.log(formatFinding(finding)))
      break
    case BATCH_STATUSES.VOID:
      console.log(`\n${heading} — VOID over its ${result.endpointTier} endpoint`)
      console.log(`    no claim made about any address: ${result.reason}`)
      break
    case BATCH_STATUSES.SKIPPED:
      console.log(`\n${heading} — skipped: ${result.reason}`)
      break
  }

  malformed.forEach(({ path, value }) => {
    console.log(`    ${path.padEnd(PATH_COLUMN)} ${value}  not a valid address`)
  })
}

interface Negative {
  readonly chain: string
  readonly path: string
  readonly detail: string
}

async function main(): Promise<ExitCode> {
  const tier = API_KEY === '' ? 'public endpoints only' : 'keyed endpoints where recorded'
  console.log(`On-chain verification — ${tier}`)

  const counts = { checked: 0, void: 0, skipped: 0 }
  const negatives: Negative[] = []

  for (const chainId of getSupportedChainIds()) {
    const chain = getChainOrThrow(chainId)
    const { targets, malformed } = collectTargets(chain)

    const result = await verifyChain(chain, targets)
    report(chain, result, malformed)

    counts[result.status] += 1

    negativesIn(result).forEach((finding) => {
      negatives.push({
        chain: chain.name,
        path: finding.path,
        detail: `${finding.outcome} (${finding.address})`,
      })
    })
    malformed.forEach(({ path, value }) => {
      negatives.push({ chain: chain.name, path, detail: `not a valid address (${value})` })
    })
  }

  console.log(
    `\n${counts.checked} checked, ${counts.void} void, ${counts.skipped} skipped` +
      ` — ${negatives.length} negative finding(s)`,
  )

  if (negatives.length > 0) {
    console.log('')
    negatives.forEach(({ chain, path, detail }) => {
      console.log(`  • ${chain} ${path}: ${detail}`)
    })
  }

  const code = exitCodeFor({ checkedChains: counts.checked, negatives: negatives.length })
  if (code === EXIT_CODES.NOTHING_VERIFIED) {
    console.log('\nNo address was observed on any chain: this run verified nothing.')
  }
  return code
}

main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((cause: unknown) => {
    console.error(`\nVerification could not run: ${describe(cause)}`)
    process.exitCode = EXIT_CODES.NOTHING_VERIFIED
  })
