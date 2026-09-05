import type { ProtocolDeployment } from '../chains/types'

/** What checking one recorded address against live chain state established. */
export const OUTCOMES = {
  PRESENT: 'present',
  ABSENT: 'absent',
  ROLE_OK: 'role-ok',
  ROLE_SIBLING: 'role-sibling',
  ROLE_MISMATCH: 'role-mismatch',
  ROLE_UNKNOWN: 'role-unknown',
} as const

export type Outcome = (typeof OUTCOMES)[keyof typeof OUTCOMES]

/**
 * Outcomes that make the run fail. Every other outcome is informational:
 * `role-unknown` records that the role question went unanswered, which
 * establishes nothing about the address that was asked.
 */
export const NEGATIVE_OUTCOMES: ReadonlyArray<Outcome> = [OUTCOMES.ABSENT, OUTCOMES.ROLE_MISMATCH]

export const BATCH_STATUSES = {
  CHECKED: 'checked',
  VOID: 'void',
  SKIPPED: 'skipped',
} as const

export type BatchStatus = (typeof BATCH_STATUSES)[keyof typeof BATCH_STATUSES]

export const ENDPOINT_TIERS = {
  KEYED: 'keyed',
  PUBLIC: 'public',
} as const

export type EndpointTier = (typeof ENDPOINT_TIERS)[keyof typeof ENDPOINT_TIERS]

/** A clean sweep, a sweep that found a problem, and a sweep that observed nothing. */
export const EXIT_CODES = {
  OK: 0,
  NEGATIVE: 1,
  NOTHING_VERIFIED: 2,
} as const

export type ExitCode = (typeof EXIT_CODES)[keyof typeof EXIT_CODES]

/** One recorded address, named by its path through the chain config. */
export interface AddressTarget {
  readonly path: string
  /** Last segment of `path`, which decides whether a role read applies. */
  readonly field: string
  readonly address: string
  /** Absent for chain-level addresses, which belong to no protocol version. */
  readonly deployment?: ProtocolDeployment
}

export interface Finding {
  readonly path: string
  readonly address: string
  readonly codeSize: number
  readonly outcome: Outcome
  readonly returned?: string
}

/** A registry value shaped like an address that is not one. */
export interface MalformedAddress {
  readonly path: string
  readonly value: string
}

export interface CheckedBatch {
  readonly status: typeof BATCH_STATUSES.CHECKED
  readonly endpointTier: EndpointTier
  readonly findings: ReadonlyArray<Finding>
}

/** Carries no findings: an unusable endpoint says nothing about any address. */
export interface VoidBatch {
  readonly status: typeof BATCH_STATUSES.VOID
  readonly endpointTier: EndpointTier
  readonly reason: string
}

export interface SkippedBatch {
  readonly status: typeof BATCH_STATUSES.SKIPPED
  readonly reason: string
}

export type BatchResult = CheckedBatch | VoidBatch | SkippedBatch

export interface RoleReading {
  readonly outcome: Outcome
  readonly returned?: string
}
