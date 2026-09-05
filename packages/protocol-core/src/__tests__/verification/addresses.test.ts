import { describe, it, expect } from 'vitest'
import { ETHEREUM } from '../../chains/ethereum'
import { POLYGON } from '../../chains/polygon'
import type { ChainConfig } from '../../chains/types'
import { ZERO_ADDRESS, collectTargets, decodeAddress, poolDeployerOf } from '../../verification/addresses'

const FACTORY = '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28'
/** `eth_call` answers in lowercase, so fixtures are built the way one arrives. */
const FACTORY_BODY = FACTORY.slice(2).toLowerCase()

function word(hexBody: string): string {
  return `0x${hexBody}`
}

describe('verification/addresses', () => {
  describe('decodeAddress', () => {
    it('reads the trailing 20 bytes of a padded word', () => {
      expect(decodeAddress(word(`${'0'.repeat(24)}${FACTORY_BODY}`))).toBe(FACTORY.toLowerCase())
    })

    it('accepts a word without the 0x prefix', () => {
      expect(decodeAddress(`${'0'.repeat(24)}${FACTORY_BODY}`)).toBe(FACTORY.toLowerCase())
    })

    it('reads the zero address', () => {
      expect(decodeAddress(word('0'.repeat(64)))).toBe(ZERO_ADDRESS)
    })

    it('returns undefined for the bare 0x an endpoint answers when it cannot serve a call', () => {
      expect(decodeAddress('0x')).toBeUndefined()
    })

    it('returns undefined for a body shorter than one word', () => {
      expect(decodeAddress(word('0'.repeat(63)))).toBeUndefined()
    })

    it('returns undefined for a body longer than one word', () => {
      expect(decodeAddress(word('0'.repeat(65)))).toBeUndefined()
    })

    it('returns undefined for a non-hex body', () => {
      expect(decodeAddress(word(`${'0'.repeat(63)}z`))).toBeUndefined()
    })

    it('returns undefined rather than truncating a word whose upper 12 bytes are set', () => {
      const dirty = `${'0'.repeat(23)}1${FACTORY_BODY}`
      expect(decodeAddress(word(dirty))).toBeUndefined()
    })
  })

  describe('poolDeployerOf', () => {
    it('returns the pool deployer of a family that declares one', () => {
      expect(poolDeployerOf(POLYGON.deployments![0])).toBe(
        '0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92',
      )
    })

    it('returns undefined for a family that declares none', () => {
      expect(poolDeployerOf(POLYGON.deployments![1])).toBeUndefined()
    })
  })

  describe('collectTargets', () => {
    it('visits every address Polygon records, not only its deployments', () => {
      const { targets } = collectTargets(POLYGON)

      expect(targets.map((target) => target.path)).toEqual([
        'wrappedNative.address',
        'stablecoins[USDC.e].address',
        'stablecoins[USDC].address',
        'stablecoins[USDT].address',
        'stablecoins[DAI].address',
        'multicall',
        'deployments[v3].factory',
        'deployments[v3].swapRouter',
        'deployments[v3].quoter',
        'deployments[v3].positionManager',
        'deployments[v3].poolDeployer',
        'deployments[v2].factory',
        'deployments[v2].swapRouter',
      ])
    })

    it('visits the addresses of a chain that records no deployments', () => {
      const { targets } = collectTargets(ETHEREUM)

      expect(targets.map((target) => target.path)).toEqual([
        'wrappedNative.address',
        'stablecoins[USDC].address',
        'stablecoins[USDT].address',
        'stablecoins[DAI].address',
      ])
    })

    it('attaches the deployment only to addresses that belong to one', () => {
      const { targets } = collectTargets(POLYGON)
      const byPath = new Map(targets.map((target) => [target.path, target]))

      expect(byPath.get('deployments[v3].quoter')?.deployment).toBe(POLYGON.deployments![0])
      expect(byPath.get('deployments[v2].factory')?.deployment).toBe(POLYGON.deployments![1])
      expect(byPath.get('multicall')?.deployment).toBeUndefined()
      expect(byPath.get('wrappedNative.address')?.deployment).toBeUndefined()
      expect(byPath.get('stablecoins[USDC].address')?.deployment).toBeUndefined()
    })

    it('names the leaf field so role reads can be selected', () => {
      const { targets } = collectTargets(POLYGON)
      const fields = new Map(targets.map((target) => [target.path, target.field]))

      expect(fields.get('deployments[v3].quoter')).toBe('quoter')
      expect(fields.get('deployments[v3].positionManager')).toBe('positionManager')
      expect(fields.get('multicall')).toBe('multicall')
      expect(fields.get('wrappedNative.address')).toBe('address')
    })

    it('reports a truncated address instead of discarding it', () => {
      const chain: ChainConfig = {
        chainId: 999,
        name: 'Test',
        nativeSymbol: 'TST',
        wrappedNative: { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WTST', decimals: 18 },
        protocols: [],
        stablecoins: [],
        multicall: '0x6ccb9426CeceE2903FbD97fd833fD1D31c1002',
      }

      const { targets, malformed } = collectTargets(chain)

      expect(targets.map((target) => target.path)).toEqual(['wrappedNative.address'])
      expect(malformed).toEqual([
        { path: 'multicall', value: '0x6ccb9426CeceE2903FbD97fd833fD1D31c1002' },
      ])
    })

    it('ignores an array member that carries no address', () => {
      const chain = {
        ...ETHEREUM,
        stablecoins: [{ symbol: 'GHOST', decimals: 6 }],
      } as unknown as ChainConfig

      const { targets, malformed } = collectTargets(chain)

      expect(targets.map((target) => target.path)).toEqual(['wrappedNative.address'])
      expect(malformed).toEqual([])
    })

    it('names an array member of bare addresses by its index', () => {
      const chain = {
        ...ETHEREUM,
        stablecoins: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'],
      } as unknown as ChainConfig

      const { targets } = collectTargets(chain)

      expect(targets.map((target) => target.path)).toEqual([
        'wrappedNative.address',
        'stablecoins[0]',
      ])
    })

    it('ignores a field holding no value', () => {
      const chain = { ...ETHEREUM, multicall: null } as unknown as ChainConfig

      const { targets, malformed } = collectTargets(chain)

      expect(targets.map((target) => target.path)).not.toContain('multicall')
      expect(malformed).toEqual([])
    })

    it('ignores strings that are not addresses', () => {
      const { targets, malformed } = collectTargets(ETHEREUM)

      expect(targets.every((target) => target.address.startsWith('0x'))).toBe(true)
      expect(malformed).toEqual([])
    })
  })
})
