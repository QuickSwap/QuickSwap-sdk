import { describe, it, expect } from 'vitest'
import { POLYGON } from '../../chains/polygon'
import { BASE } from '../../chains/base'
import { MANTRA } from '../../chains/mantra'
import { MANTA } from '../../chains/manta'
import { SONEIUM } from '../../chains/soneium'
import { SOMNIA } from '../../chains/somnia'
import { IMX } from '../../chains/imx'
import { XLAYER } from '../../chains/xlayer'
import { ZKEVM } from '../../chains/zkevm'
import { DOGECHAIN } from '../../chains/dogechain'
import { ETHEREUM } from '../../chains/ethereum'
import type { ChainConfig } from '../../chains/types'

const ALL_CHAINS: ChainConfig[] = [
  POLYGON,
  BASE,
  MANTRA,
  MANTA,
  SONEIUM,
  SOMNIA,
  IMX,
  XLAYER,
  ZKEVM,
  DOGECHAIN,
  ETHEREUM,
]

describe('chain data integrity', () => {
  describe('basic fields', () => {
    it.each(ALL_CHAINS)('$name has positive chainId', (chain) => {
      expect(chain.chainId).toBeGreaterThan(0)
    })

    it.each(ALL_CHAINS)('$name has non-empty name', (chain) => {
      expect(chain.name).toBeTruthy()
      expect(chain.name.length).toBeGreaterThan(0)
    })

    it.each(ALL_CHAINS)('$name has non-empty nativeSymbol', (chain) => {
      expect(chain.nativeSymbol).toBeTruthy()
      expect(chain.nativeSymbol.length).toBeGreaterThan(0)
    })
  })

  describe('wrappedNative decimals', () => {
    it.each(ALL_CHAINS)('$name wrappedNative has 18 decimals', (chain) => {
      expect(chain.wrappedNative.decimals).toBe(18)
    })
  })

  describe('stablecoin decimals', () => {
    it.each(ALL_CHAINS)('$name stablecoins all have 6 or 18 decimals', (chain) => {
      for (const coin of chain.stablecoins) {
        expect([6, 18]).toContain(coin.decimals)
      }
    })
  })

  describe('stablecoin counts', () => {
    it('Polygon has 4 stablecoins', () => {
      expect(POLYGON.stablecoins).toHaveLength(4)
    })

    it('Base has 2 stablecoins', () => {
      expect(BASE.stablecoins).toHaveLength(2)
    })

    it('MANTRA has 4 stablecoins', () => {
      expect(MANTRA.stablecoins).toHaveLength(4)
    })

    it('Manta has 3 stablecoins', () => {
      expect(MANTA.stablecoins).toHaveLength(3)
    })

    it('Soneium has 2 stablecoins', () => {
      expect(SONEIUM.stablecoins).toHaveLength(2)
    })

    it('Somnia has 2 stablecoins', () => {
      expect(SOMNIA.stablecoins).toHaveLength(2)
    })

    it('IMX has 4 stablecoins', () => {
      expect(IMX.stablecoins).toHaveLength(4)
    })

    it('X Layer has 3 stablecoins', () => {
      expect(XLAYER.stablecoins).toHaveLength(3)
    })

    it('zkEVM has 3 stablecoins', () => {
      expect(ZKEVM.stablecoins).toHaveLength(3)
    })

    it('Dogechain has 3 stablecoins', () => {
      expect(DOGECHAIN.stablecoins).toHaveLength(3)
    })

    it('Ethereum has 3 stablecoins', () => {
      expect(ETHEREUM.stablecoins).toHaveLength(3)
    })
  })

  describe('protocol entries', () => {
    it('Ethereum has empty protocols (aggregation-only)', () => {
      expect(ETHEREUM.protocols).toHaveLength(0)
    })

    it('Polygon protocols: v3 before v2', () => {
      expect(POLYGON.protocols[0].version).toBe('v3')
      expect(POLYGON.protocols[1].version).toBe('v2')
    })

    it('Base protocols: v4 before v2', () => {
      expect(BASE.protocols[0].version).toBe('v4')
      expect(BASE.protocols[1].version).toBe('v2')
    })

    it('Dogechain protocols: v3 before v2', () => {
      expect(DOGECHAIN.protocols[0].version).toBe('v3')
      expect(DOGECHAIN.protocols[1].version).toBe('v2')
    })

    it('zkEVM protocols: v3 before univ3', () => {
      expect(ZKEVM.protocols[0].version).toBe('v3')
      expect(ZKEVM.protocols[1].version).toBe('univ3')
    })

    it('MANTRA has v4 with exposeDynamicFee', () => {
      expect(MANTRA.protocols).toHaveLength(1)
      expect(MANTRA.protocols[0].version).toBe('v4')
      expect(MANTRA.protocols[0].exposeDynamicFee).toBe(true)
    })

    it('Manta has univ3 without exposeDynamicFee', () => {
      expect(MANTA.protocols).toHaveLength(1)
      expect(MANTA.protocols[0].version).toBe('univ3')
      expect(MANTA.protocols[0].exposeDynamicFee).toBe(false)
    })
  })

  describe('Ethereum stablecoins', () => {
    it('Ethereum includes USDC', () => {
      const symbols = ETHEREUM.stablecoins.map((s) => s.symbol)
      expect(symbols).toContain('USDC')
    })

    it('Ethereum includes USDT', () => {
      const symbols = ETHEREUM.stablecoins.map((s) => s.symbol)
      expect(symbols).toContain('USDT')
    })
  })

  describe('Dogechain DAI isolation', () => {
    const ZKEVM_DAI_ADDRESS = '0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4'

    it('Dogechain DAI is NOT the zkEVM DAI address', () => {
      const dogeDai = DOGECHAIN.stablecoins.find((s) => s.symbol === 'DAI')
      expect(dogeDai).toBeDefined()
      expect(dogeDai!.address).not.toBe(ZKEVM_DAI_ADDRESS)
    })

    it('Dogechain DAI address is the correct Dogechain-native DAI', () => {
      const dogeDai = DOGECHAIN.stablecoins.find((s) => s.symbol === 'DAI')
      expect(dogeDai!.address).toBe('0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C')
    })
  })
})
