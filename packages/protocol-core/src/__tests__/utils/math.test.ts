import { describe, it, expect } from 'vitest'
import { percentChange } from '../../utils/math'

describe('utils/math', () => {
  describe('percentChange', () => {
    it('calculates positive change', () => {
      expect(percentChange(110, 100)).toBe(10)
    })

    it('returns 0 when previous is 0 (divide-by-zero guard)', () => {
      expect(percentChange(100, 0)).toBe(0)
    })

    it('calculates negative change', () => {
      expect(percentChange(5, 10)).toBe(-50)
    })

    it('returns 0 when values are equal', () => {
      expect(percentChange(100, 100)).toBe(0)
    })

    it('handles negative values', () => {
      expect(percentChange(-50, -100)).toBe(-50)
    })

    it('handles both zero', () => {
      expect(percentChange(0, 0)).toBe(0)
    })
  })
})
