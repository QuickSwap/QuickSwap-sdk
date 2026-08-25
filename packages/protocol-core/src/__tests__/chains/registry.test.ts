import { describe, it, expect } from 'vitest'
import { CHAIN_REGISTRY, CHAIN_ID, getChain, getChainOrThrow, getSupportedChainIds } from '../../chains/registry'
import type { ChainConfig, TokenInfo } from '../../chains/types'
import * as publicApi from '../../index'
import {
  SUPPORTED_CHAINS,
  SUPPORTED_CHAIN_IDS,
  SUPPORTED_CHAIN_KEYS,
  sortedChainIds,
} from '../fixtures/supported-chains'

function isChainConfig(value: unknown): value is ChainConfig {
  return typeof value === 'object' && value !== null && 'chainId' in value
}

type RetiredChain = { readonly chainId: number; readonly name: string }

const WITHDRAWN_CHAINS: ReadonlyArray<RetiredChain> = [
  { chainId: 1101, name: 'Polygon zkEVM' },
  { chainId: 2000, name: 'Dogechain' },
]

const DAPP_RETIRED_CHAINS: ReadonlyArray<RetiredChain> = [
  { chainId: 3776, name: 'Astar zkEVM' },
  { chainId: 195, name: 'X1 testnet' },
  { chainId: 1261120, name: 'zKatana testnet' },
  { chainId: 1442, name: 'Polygon zkEVM testnet' },
  { chainId: 568, name: 'Dogechain testnet' },
]

function assertStaysUnregistered(chains: ReadonlyArray<RetiredChain>) {
  it.each(chains)('$name has no registry entry', ({ chainId }) => {
    const chain = getChain(chainId)

    expect(chain).toBeUndefined()
  })

  it.each(chains)('$name stays out of the supported list', ({ chainId }) => {
    const supported = getSupportedChainIds()

    expect(supported).not.toContain(chainId)
  })

  it.each(chains)('$name cannot be resolved', ({ chainId }) => {
    expect(() => getChainOrThrow(chainId)).toThrow(`Unsupported chain: ${chainId}`)
  })

  it.each(chains)('$name is not published by the package', ({ chainId }) => {
    const publishedChainIds = Object.values(publicApi)
      .filter(isChainConfig)
      .map((chain) => chain.chainId)

    expect(publishedChainIds).not.toContain(chainId)
  })
}

describe('The chain registry', () => {
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

  describe('The supported chain list', () => {
    it('matches the expected set of chains exactly', () => {
      const supported = getSupportedChainIds()

      expect(sortedChainIds(supported)).toEqual(sortedChainIds(SUPPORTED_CHAIN_IDS))
    })
  })

  describe('getChainOrThrow', () => {
    it('returns config for known chain', () => {
      const chain = getChainOrThrow(137)
      expect(chain.name).toBe('Polygon PoS')
    })

    it('throws for unknown chain', () => {
      expect(() => getChainOrThrow(99999)).toThrow('Unsupported chain: 99999')
    })
  })

  describe('The chain ID map', () => {
    it('maps every chain key to its chain ID', () => {
      const mapped = SUPPORTED_CHAINS.map(({ key }) => CHAIN_ID[key])

      expect(mapped).toEqual([...SUPPORTED_CHAIN_IDS])
    })

    it('names exactly the supported chains', () => {
      expect(Object.keys(CHAIN_ID)).toEqual([...SUPPORTED_CHAIN_KEYS])
    })

    it('every CHAIN_ID value exists in registry', () => {
      for (const id of Object.values(CHAIN_ID)) {
        expect(getChain(id)).toBeDefined()
      }
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

  describe('The chains withdrawn from this registry', () => {
    assertStaysUnregistered(WITHDRAWN_CHAINS)
  })

  describe('The chains retired from the dapp before this registry existed', () => {
    assertStaysUnregistered(DAPP_RETIRED_CHAINS)
  })
})
