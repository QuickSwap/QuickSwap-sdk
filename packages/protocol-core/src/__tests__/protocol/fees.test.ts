import { describe, it, expect } from 'vitest'
import { V2_FEE_BPS, V2_FEE_RATE, computeV2Fees } from '../../protocol/fees'

describe('protocol/fees', () => {
  it('V2_FEE_BPS is 30', () => {
    expect(V2_FEE_BPS).toBe(30)
  })

  it('V2_FEE_RATE is 0.003', () => {
    expect(V2_FEE_RATE).toBe(0.003)
  })

  describe('computeV2Fees', () => {
    it('calculates correct fee', () => {
      expect(computeV2Fees(1000)).toBeCloseTo(3, 10)
    })

    it('returns 0 for 0 input', () => {
      expect(computeV2Fees(0)).toBe(0)
    })
  })
})
