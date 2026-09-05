import { describe, it, expect } from 'vitest'
import {
  exitCodeFor,
  firstCheckedBatch,
  negativesIn,
  runBatch,
} from '../../verification/batch'
import type { BatchProbe } from '../../verification/batch'
import {
  BATCH_STATUSES,
  ENDPOINT_TIERS,
  EXIT_CODES,
  OUTCOMES,
} from '../../verification/model'
import type { AddressTarget, CheckedBatch, Finding, VoidBatch } from '../../verification/model'

class EndpointFault extends Error {}

const TARGETS: ReadonlyArray<AddressTarget> = [
  { path: 'multicall', field: 'multicall', address: '0x6ccb9426CeceE2903FbD97fd833fD1D31c100292' },
  {
    path: 'wrappedNative.address',
    field: 'address',
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  },
]

function findingFor(target: AddressTarget, outcome: Finding['outcome']): Finding {
  return { path: target.path, address: target.address, codeSize: 1234, outcome }
}

function probe(overrides: Partial<BatchProbe> = {}): BatchProbe {
  return {
    control: () => Promise.resolve(),
    inspect: (target) => Promise.resolve(findingFor(target, OUTCOMES.PRESENT)),
    voidReason: (cause) => (cause instanceof EndpointFault ? cause.message : undefined),
    ...overrides,
  }
}

function checked(findings: ReadonlyArray<Finding>): CheckedBatch {
  return { status: BATCH_STATUSES.CHECKED, endpointTier: ENDPOINT_TIERS.PUBLIC, findings }
}

function voided(reason: string): VoidBatch {
  return { status: BATCH_STATUSES.VOID, endpointTier: ENDPOINT_TIERS.PUBLIC, reason }
}

describe('verification/batch', () => {
  describe('runBatch', () => {
    it('reports checked when the control holds on both sides of the sweep', async () => {
      const result = await runBatch(ENDPOINT_TIERS.KEYED, TARGETS, probe())

      expect(result.status).toBe(BATCH_STATUSES.CHECKED)
      expect(result.endpointTier).toBe(ENDPOINT_TIERS.KEYED)
      expect(result.status === BATCH_STATUSES.CHECKED && result.findings).toHaveLength(2)
    })

    it('reads the control before and after the sweep', async () => {
      const order: string[] = []
      await runBatch(
        ENDPOINT_TIERS.PUBLIC,
        TARGETS,
        probe({
          control: () => {
            order.push('control')
            return Promise.resolve()
          },
          inspect: (target) => {
            order.push(target.path)
            return Promise.resolve(findingFor(target, OUTCOMES.PRESENT))
          },
        }),
      )

      expect(order).toEqual(['control', 'multicall', 'wrappedNative.address', 'control'])
    })

    it('yields void, carrying no findings, when the opening control fails', async () => {
      const result = await runBatch(
        ENDPOINT_TIERS.PUBLIC,
        TARGETS,
        probe({ control: () => Promise.reject(new EndpointFault('control could not be called')) }),
      )

      expect(result).toEqual(voided('control could not be called'))
      expect(result).not.toHaveProperty('findings')
    })

    it('yields void, discarding findings already gathered, when the closing control fails', async () => {
      let reads = 0
      const result = await runBatch(
        ENDPOINT_TIERS.PUBLIC,
        TARGETS,
        probe({
          control: () => {
            reads += 1
            return reads === 1
              ? Promise.resolve()
              : Promise.reject(new EndpointFault('control stopped answering'))
          },
        }),
      )

      expect(result).toEqual(voided('control stopped answering'))
      expect(result).not.toHaveProperty('findings')
    })

    it('yields void when the endpoint fails mid-sweep', async () => {
      const result = await runBatch(
        ENDPOINT_TIERS.PUBLIC,
        TARGETS,
        probe({ inspect: () => Promise.reject(new EndpointFault('eth_getCode: HTTP 503')) }),
      )

      expect(result).toEqual(voided('eth_getCode: HTTP 503'))
    })

    it('rethrows a cause the probe does not recognise as an endpoint fault', async () => {
      await expect(
        runBatch(
          ENDPOINT_TIERS.PUBLIC,
          TARGETS,
          probe({ inspect: () => Promise.reject(new Error('programming error')) }),
        ),
      ).rejects.toThrow('programming error')
    })
  })

  describe('firstCheckedBatch', () => {
    it('runs the only candidate', async () => {
      const tried: string[] = []
      const result = await firstCheckedBatch(['only'], (candidate) => {
        tried.push(candidate)
        return Promise.resolve(checked([]))
      })

      expect(tried).toEqual(['only'])
      expect(result.status).toBe(BATCH_STATUSES.CHECKED)
    })

    it('stops at the first candidate that observed something', async () => {
      const tried: string[] = []
      const result = await firstCheckedBatch(['keyed', 'public'], (candidate) => {
        tried.push(candidate)
        return Promise.resolve(checked([]))
      })

      expect(tried).toEqual(['keyed'])
      expect(result.status).toBe(BATCH_STATUSES.CHECKED)
    })

    it('falls through to the next candidate after a void', async () => {
      const tried: string[] = []
      const result = await firstCheckedBatch(['keyed', 'public'], (candidate) => {
        tried.push(candidate)
        return Promise.resolve(candidate === 'keyed' ? voided('HTTP 401') : checked([]))
      })

      expect(tried).toEqual(['keyed', 'public'])
      expect(result.status).toBe(BATCH_STATUSES.CHECKED)
    })

    it('keeps the last void when no candidate observed anything', async () => {
      const result = await firstCheckedBatch(['keyed', 'public'], (candidate) =>
        Promise.resolve(voided(`${candidate} unreachable`)),
      )

      expect(result).toEqual(voided('public unreachable'))
    })
  })

  describe('negativesIn', () => {
    it('keeps absent and mismatched addresses', () => {
      const findings = [
        findingFor(TARGETS[0], OUTCOMES.ABSENT),
        findingFor(TARGETS[1], OUTCOMES.ROLE_MISMATCH),
      ]

      expect(negativesIn(checked(findings))).toEqual(findings)
    })

    it('does not treat an unanswered role check as negative', () => {
      const findings = [
        findingFor(TARGETS[0], OUTCOMES.PRESENT),
        findingFor(TARGETS[1], OUTCOMES.ROLE_UNKNOWN),
      ]

      expect(negativesIn(checked(findings))).toEqual([])
    })

    it('does not treat a matched role as negative', () => {
      const findings = [
        findingFor(TARGETS[0], OUTCOMES.ROLE_OK),
        findingFor(TARGETS[1], OUTCOMES.ROLE_SIBLING),
      ]

      expect(negativesIn(checked(findings))).toEqual([])
    })

    it('draws no finding from a void batch', () => {
      expect(negativesIn(voided('control could not be called'))).toEqual([])
    })

    it('draws no finding from a skipped chain', () => {
      expect(
        negativesIn({ status: BATCH_STATUSES.SKIPPED, reason: 'records no addresses' }),
      ).toEqual([])
    })
  })

  describe('exitCodeFor', () => {
    it('reports success for a clean sweep', () => {
      expect(exitCodeFor({ checkedChains: 8, negatives: 0 })).toBe(EXIT_CODES.OK)
    })

    it('reports failure when a negative finding was recorded', () => {
      expect(exitCodeFor({ checkedChains: 8, negatives: 1 })).toBe(EXIT_CODES.NEGATIVE)
    })

    it('does not report success when no chain was checked', () => {
      expect(exitCodeFor({ checkedChains: 0, negatives: 0 })).toBe(EXIT_CODES.NOTHING_VERIFIED)
    })

    it('reports failure over nothing-verified when both apply', () => {
      expect(exitCodeFor({ checkedChains: 0, negatives: 2 })).toBe(EXIT_CODES.NEGATIVE)
    })
  })
})
