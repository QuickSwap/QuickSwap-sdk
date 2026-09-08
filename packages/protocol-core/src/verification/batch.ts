import { BATCH_STATUSES, EXIT_CODES, NEGATIVE_OUTCOMES } from './model'
import type {
  AddressTarget,
  BatchResult,
  CheckedBatch,
  EndpointTier,
  ExitCode,
  Finding,
  VoidBatch,
} from './model'

/** The endpoint-facing reads one batch performs. */
export interface BatchProbe {
  /** Proves the endpoint answers, over this connection, the transports the sweep uses. */
  readonly control: () => Promise<void>
  readonly inspect: (target: AddressTarget) => Promise<Finding>
  /** Renders a thrown value as a void reason, or returns undefined to rethrow it. */
  readonly voidReason: (cause: unknown) => string | undefined
}

/**
 * Runs one set of targets against one endpoint. The control is read before and
 * after the sweep, and either read failing discards the batch, so a run that
 * observed nothing reports `void` rather than a list of findings.
 */
export async function runBatch(
  endpointTier: EndpointTier,
  targets: ReadonlyArray<AddressTarget>,
  probe: BatchProbe,
): Promise<CheckedBatch | VoidBatch> {
  try {
    await probe.control()

    const findings: Finding[] = []
    for (const target of targets) {
      findings.push(await probe.inspect(target))
    }

    await probe.control()

    return { status: BATCH_STATUSES.CHECKED, endpointTier, findings }
  } catch (cause) {
    const reason = probe.voidReason(cause)
    if (reason === undefined) throw cause
    return { status: BATCH_STATUSES.VOID, endpointTier, reason }
  }
}

/** Tries each endpoint in turn and keeps the first batch that observed anything. */
export async function firstCheckedBatch<C>(
  candidates: readonly [C, ...ReadonlyArray<C>],
  run: (candidate: C) => Promise<CheckedBatch | VoidBatch>,
): Promise<CheckedBatch | VoidBatch> {
  const [first, ...rest] = candidates

  let result = await run(first)
  for (const candidate of rest) {
    if (result.status === BATCH_STATUSES.CHECKED) return result
    result = await run(candidate)
  }
  return result
}

/** A batch that is not `checked` observed nothing, so it reports no findings. */
export function negativesIn(result: BatchResult): ReadonlyArray<Finding> {
  if (result.status !== BATCH_STATUSES.CHECKED) return []
  return result.findings.filter((finding) => NEGATIVE_OUTCOMES.includes(finding.outcome))
}

export interface RunSummary {
  /** Chains whose recorded addresses were actually observed on chain. */
  readonly checkedChains: number
  readonly negatives: number
}

/**
 * Separates the three states a run can end in, so "nothing was verified" is
 * reported apart from both a clean sweep and a sweep that found a problem.
 */
export function exitCodeFor(summary: RunSummary): ExitCode {
  if (summary.negatives > 0) return EXIT_CODES.NEGATIVE
  if (summary.checkedChains === 0) return EXIT_CODES.NOTHING_VERIFIED
  return EXIT_CODES.OK
}
