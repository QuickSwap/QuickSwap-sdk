import { describe, it, expect } from 'vitest'
import { getStablecoins, getStablecoinAddresses, isStablecoin } from '../../tokens/stablecoins'

describe('tokens/stablecoins', () => {
  describe('getStablecoins', () => {
    it('returns 4 stablecoins for MANTRA (5888)', () => {
      const result = getStablecoins(5888)
      expect(result).toHaveLength(4)
      expect(result.map((s) => s.symbol)).toContain('mantraUSD')
    })

    it('returns 4 stablecoins for IMX (13371)', () => {
      const result = getStablecoins(13371)
      expect(result).toHaveLength(4)
      expect(result.map((s) => s.symbol)).toContain('axlUSDC')
    })

    it('returns 3 stablecoins for Ethereum (1)', () => {
      expect(getStablecoins(1)).toHaveLength(3)
    })

    it('returns [] for unknown chain', () => {
      expect(getStablecoins(99999)).toEqual([])
    })
  })

  describe('getStablecoinAddresses', () => {
    it('returns lowercase addresses', () => {
      const addresses = getStablecoinAddresses(137)
      addresses.forEach((addr) => {
        expect(addr).toBe(addr.toLowerCase())
      })
    })

    it('returns 4 addresses for Polygon', () => {
      expect(getStablecoinAddresses(137)).toHaveLength(4)
    })
  })

  describe('isStablecoin', () => {
    it('returns true for known stablecoin (lowercase input)', () => {
      expect(isStablecoin(137, '0x2791bca1f2de4661ed88a30c99a7a9449aa84174')).toBe(true)
    })

    it('returns true for known stablecoin (checksummed input)', () => {
      expect(isStablecoin(137, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')).toBe(true)
    })

    it('returns false for non-stablecoin address', () => {
      expect(isStablecoin(137, '0x0000000000000000000000000000000000000001')).toBe(false)
    })

    it('returns false for unknown chain', () => {
      expect(isStablecoin(99999, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')).toBe(false)
    })
  })
})
