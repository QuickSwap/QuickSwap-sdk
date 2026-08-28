import { describe, it, expect } from 'vitest'
import { getNativeToken, getWrappedNative } from '../../tokens/native'
import { SUPPORTED_CHAIN_IDS } from '../fixtures/supported-chains'

describe('tokens/native', () => {
  describe('getNativeToken', () => {
    it('returns POL info for Polygon', () => {
      const result = getNativeToken(137)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('POL')
      expect(result!.decimals).toBe(18)
    })

    it('returns ETH info for Base', () => {
      const result = getNativeToken(8453)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('ETH')
    })

    it('returns SOMI info for Somnia', () => {
      const result = getNativeToken(5031)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('SOMI')
    })

    it('returns undefined for unknown chain', () => {
      expect(getNativeToken(99999)).toBeUndefined()
    })
  })

  describe('getWrappedNative', () => {
    it('returns WPOL for Polygon', () => {
      const result = getWrappedNative(137)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('WPOL')
      expect(result!.decimals).toBe(18)
    })

    it('returns WETH for Base', () => {
      const result = getWrappedNative(8453)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('WETH')
    })

    it('returns undefined for unknown chain', () => {
      expect(getWrappedNative(99999)).toBeUndefined()
    })
  })

  describe('The native and wrapped token addresses', () => {
    it.each(SUPPORTED_CHAIN_IDS)('match each other on chain %i', (chainId) => {
      const native = getNativeToken(chainId)
      const wrapped = getWrappedNative(chainId)

      expect(native).toBeDefined()
      expect(wrapped).toBeDefined()
      expect(native!.address).toBe(wrapped!.address)
    })
  })
})
