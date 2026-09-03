import { describe, it, expect } from 'vitest'
import { POLYGON } from '../../chains/polygon'
import { BASE } from '../../chains/base'
import { MANTRA } from '../../chains/mantra'
import { MANTA } from '../../chains/manta'
import { SONEIUM } from '../../chains/soneium'
import { SOMNIA } from '../../chains/somnia'
import { IMX } from '../../chains/imx'
import { XLAYER } from '../../chains/xlayer'
import { ETHEREUM } from '../../chains/ethereum'
import { CHAIN_REGISTRY } from '../../chains/registry'
import { checkDeploymentCoherence } from '../../chains/deploymentCoherence'
import type { ChainConfig, ProtocolVersion } from '../../chains/types'

const ALL_CHAINS: ChainConfig[] = [
  POLYGON,
  BASE,
  MANTRA,
  MANTA,
  SONEIUM,
  SOMNIA,
  IMX,
  XLAYER,
  ETHEREUM,
]

const CHAINS_WITH_DEPLOYMENTS = ALL_CHAINS.filter((chain) => chain.deployments !== undefined)

const CHAINS_WITH_MULTICALL = ALL_CHAINS.filter((chain) => chain.multicall !== undefined)

const UNISWAP_FORK_ADDRESSES = [
  {
    chain: MANTA,
    factory: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
    positionManager: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  },
  {
    chain: IMX,
    factory: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
    positionManager: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  },
]

// X Layer and Immutable zkEVM record the same aggregator address, and MANTRA
// records the widely deployed canonical Multicall3 address. Each value is the
// aggregator live on that chain.
const MULTICALL_ADDRESSES = [
  { chain: BASE, multicall: '0xfEE958Fa595B4478cea7560C91400A98b83d6C91' },
  { chain: MANTRA, multicall: '0xcA11bde05977b3631167028862bE2a173976CA11' },
  { chain: SONEIUM, multicall: '0x69465675e2125414f26ED3139218abBDDe3C4daa' },
  { chain: SOMNIA, multicall: '0x5e44F178E8cF9B2F5409B6f18ce936aB817C5a11' },
  { chain: XLAYER, multicall: '0xc7efb32470dEE601959B15f1f923e017C6A918cA' },
]

/** Concentrated-liquidity families that derive pools from a dedicated deployer. */
const ALGEBRA_ENTRIES: ReadonlyArray<{ chain: ChainConfig; version: ProtocolVersion }> = [
  { chain: BASE, version: 'v4' },
  { chain: MANTRA, version: 'v4' },
  { chain: SONEIUM, version: 'v4' },
  { chain: SOMNIA, version: 'v4' },
  { chain: XLAYER, version: 'v3' },
]

describe('The chain configuration data', () => {
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

  describe('The stablecoin coverage', () => {
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

    it('Ethereum has 3 stablecoins', () => {
      expect(ETHEREUM.stablecoins).toHaveLength(3)
    })
  })

  describe('The protocol entries', () => {
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

  describe('The deployment fixtures', () => {
    it('populates deployment data on more than one chain', () => {
      expect(CHAINS_WITH_DEPLOYMENTS.length).toBeGreaterThan(1)
    })

    it('covers every chain that declares a live protocol version', () => {
      const missing = ALL_CHAINS.filter(
        (chain) => chain.protocols.length > 0 && chain.deployments === undefined,
      )

      expect(missing).toEqual([])
    })

    it('leaves the aggregation-only chain without deployments', () => {
      expect(ETHEREUM.deployments).toBeUndefined()
    })

    it('lists the Polygon entries in the order its protocols declare them', () => {
      const declaredOrder = POLYGON.protocols.map((protocol) => protocol.version)
      const deployedOrder = POLYGON.deployments!.map((deployment) => deployment.version)

      expect(deployedOrder).toEqual(declaredOrder)
    })

    it.each([MANTA, IMX])('gives $name the single Uniswap-V3 fork entry it declares', (chain) => {
      const versions = chain.deployments!.map((deployment) => deployment.version)

      expect(versions).toEqual(['univ3'])
    })

    it('limits the Polygon v2 entry to the contracts that family deploys', () => {
      const v2 = POLYGON.deployments!.find((deployment) => deployment.version === 'v2')!

      expect(Object.keys(v2).sort()).toEqual(['factory', 'swapRouter', 'version'])
    })

    it('gives the Polygon Algebra entry a pool deployer', () => {
      const v3 = POLYGON.deployments!.find((deployment) => deployment.version === 'v3')!

      expect(v3).toHaveProperty('poolDeployer')
    })

    it.each([MANTA, IMX])('leaves the $name entry without a pool deployer', (chain) => {
      const univ3 = chain.deployments!.find((deployment) => deployment.version === 'univ3')!

      expect(Object.keys(univ3)).not.toContain('poolDeployer')
    })

    // Manta Pacific and Immutable zkEVM deploy the same factory and the same
    // position manager. Both values match the contracts deployed on each chain.
    it.each(UNISWAP_FORK_ADDRESSES)(
      'pins the $chain.name factory and position manager',
      ({ chain, factory, positionManager }) => {
        const univ3 = chain.deployments!.find((deployment) => deployment.version === 'univ3')!

        expect(univ3.factory).toBe(factory)
        expect(univ3).toHaveProperty('positionManager', positionManager)
      },
    )

    it.each(ALGEBRA_ENTRIES)(
      'gives the $chain.name $version entry a pool deployer',
      ({ chain, version }) => {
        const entry = chain.deployments!.find((deployment) => deployment.version === version)!

        expect(entry).toHaveProperty('poolDeployer')
      },
    )

    it('limits the Base v2 entry to the contracts that family deploys', () => {
      const v2 = BASE.deployments!.find((deployment) => deployment.version === 'v2')!

      expect(Object.keys(v2).sort()).toEqual(['factory', 'swapRouter', 'version'])
    })

    it('lists the Base entries in the order its protocols declare them', () => {
      const declaredOrder = BASE.protocols.map((protocol) => protocol.version)
      const deployedOrder = BASE.deployments!.map((deployment) => deployment.version)

      expect(deployedOrder).toEqual(declaredOrder)
    })
  })

  describe('The multicall addresses', () => {
    it('populates a multicall address on more than one chain', () => {
      expect(CHAINS_WITH_MULTICALL.length).toBeGreaterThan(1)
    })

    it.each(CHAINS_WITH_MULTICALL)('gives $name a multicall address', (chain) => {
      expect(chain.multicall).toMatch(/^0x[0-9a-fA-F]{40}$/)
    })

    it('covers every chain that carries deployment data', () => {
      expect(CHAINS_WITH_MULTICALL).toHaveLength(CHAINS_WITH_DEPLOYMENTS.length)
    })

    it.each(MULTICALL_ADDRESSES)('pins the $chain.name aggregator', ({ chain, multicall }) => {
      expect(chain.multicall).toBe(multicall)
    })
  })

  describe('The registry deployment coherence', () => {
    const REGISTERED_CHAINS = Object.values(CHAIN_REGISTRY)

    it('exercises the coherence rules against real deployment data', () => {
      const carrying = REGISTERED_CHAINS.filter((chain) => chain.deployments !== undefined)

      expect(carrying.length).toBeGreaterThan(1)
    })

    it.each(REGISTERED_CHAINS)('keeps $name coherent with the protocols it declares', (chain) => {
      const violations = checkDeploymentCoherence(chain)

      expect(violations).toEqual([])
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
})
