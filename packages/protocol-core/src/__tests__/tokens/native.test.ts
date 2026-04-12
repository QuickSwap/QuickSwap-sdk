import { describe, it, expect } from 'vitest'
import { getNativeToken, getWrappedNative } from '../../tokens/native'

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
    it('returns WMATIC for Polygon', () => {
      const result = getWrappedNative(137)
      expect(result).toBeDefined()
      expect(result!.symbol).toBe('WMATIC')
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

  describe('address equality', () => {
    it('getNativeToken and getWrappedNative share the same address', () => {
      const chains = [137, 8453, 5888, 169, 1868, 5031, 13371, 196, 1101, 2000, 1]
      for (const chainId of chains) {
        const native = getNativeToken(chainId)
        const wrapped = getWrappedNative(chainId)
        expect(native?.address).toBe(wrapped?.address)
      }
    })
  })
})
