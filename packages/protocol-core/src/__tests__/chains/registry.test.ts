import { describe, it, expect } from 'vitest'
import { CHAIN_REGISTRY, getChain, getSupportedChainIds } from '../../chains/registry'

const EXPECTED_CHAIN_IDS = [137, 8453, 5888, 169, 1868, 5031, 13371, 196, 1101, 2000, 1]

describe('chain registry', () => {
  describe('getChain', () => {
    it('returns MANTRA config for chainId 5888', () => {
      const chain = getChain(5888)
      expect(chain).toBeDefined()
      expect(chain!.name).toBe('MANTRA')
      expect(chain!.chainId).toBe(5888)
    })

    it('returns undefined for unknown chainId', () => {
      expect(getChain(99999)).toBeUndefined()
    })

    it('returns Polygon config for chainId 137', () => {
      const chain = getChain(137)
      expect(chain).toBeDefined()
      expect(chain!.nativeSymbol).toBe('POL')
    })

    it('returns Ethereum config for chainId 1', () => {
      const chain = getChain(1)
      expect(chain).toBeDefined()
      expect(chain!.protocols).toHaveLength(0)
    })
  })

  describe('getSupportedChainIds', () => {
    it('has length 11', () => {
      expect(getSupportedChainIds()).toHaveLength(11)
    })

    it.each(EXPECTED_CHAIN_IDS)('contains chainId %i', (chainId) => {
      expect(getSupportedChainIds()).toContain(chainId)
    })
  })

  describe('immutability', () => {
    it('CHAIN_REGISTRY is frozen', () => {
      expect(Object.isFrozen(CHAIN_REGISTRY)).toBe(true)
    })

    it('mutation of CHAIN_REGISTRY top-level has no effect', () => {
      const before = CHAIN_REGISTRY[137]
      try {
        // @ts-expect-error intentional mutation attempt
        CHAIN_REGISTRY[137] = undefined
      } catch {
        // strict mode throws — that's fine
      }
      expect(CHAIN_REGISTRY[137]).toBe(before)
    })

    it('nested stablecoins array is frozen (deep freeze)', () => {
      const polygon = getChain(137)!
      expect(Object.isFrozen(polygon.stablecoins)).toBe(true)
    })

    it('push to frozen stablecoins silently fails or throws', () => {
      const polygon = getChain(137)!
      const lengthBefore = polygon.stablecoins.length
      try {
        // @ts-expect-error intentional mutation attempt on readonly
        ;(polygon.stablecoins as TokenInfo[]).push({ address: '0x0', symbol: 'FAKE', decimals: 6 })
      } catch {
        // strict mode throws — acceptable
      }
      expect(polygon.stablecoins).toHaveLength(lengthBefore)
    })

    it('wrappedNative object is frozen', () => {
      const polygon = getChain(137)!
      expect(Object.isFrozen(polygon.wrappedNative)).toBe(true)
    })
  })
})
