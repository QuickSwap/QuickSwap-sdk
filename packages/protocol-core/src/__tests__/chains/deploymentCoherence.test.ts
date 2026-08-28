import { describe, it, expect } from 'vitest'
import { checkDeploymentCoherence } from '../../chains/deploymentCoherence'
import {
  PROTOCOL_VERSIONS,
  type ChainConfig,
  type ProtocolDeployment,
} from '../../chains/types'

const FACTORY = '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28'
const ROUTER = '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff'
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
const NATIVE_SENTINEL_LOWERCASE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
const NATIVE_SENTINEL_CHECKSUMMED = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function buildChain(overrides: Partial<ChainConfig> = {}): ChainConfig {
  return {
    chainId: 137,
    name: 'Test Chain',
    nativeSymbol: 'POL',
    wrappedNative: { address: FACTORY, symbol: 'WPOL', decimals: 18 },
    protocols: [{ version: PROTOCOL_VERSIONS.V2, exposeDynamicFee: false }],
    stablecoins: [],
    ...overrides,
  }
}

const COHERENT_V2_ENTRY = {
  version: PROTOCOL_VERSIONS.V2,
  factory: FACTORY,
  swapRouter: ROUTER,
} as const

/** One entry per family with every address slot filled by a sentinel. */
const ALL_SENTINEL_ENTRIES: ReadonlyArray<ProtocolDeployment> = [
  { version: PROTOCOL_VERSIONS.V2, factory: ZERO_ADDRESS, swapRouter: ZERO_ADDRESS },
  {
    version: PROTOCOL_VERSIONS.V3,
    factory: ZERO_ADDRESS,
    swapRouter: ZERO_ADDRESS,
    quoter: ZERO_ADDRESS,
    positionManager: ZERO_ADDRESS,
    poolDeployer: ZERO_ADDRESS,
  },
  {
    version: PROTOCOL_VERSIONS.V4,
    factory: ZERO_ADDRESS,
    swapRouter: ZERO_ADDRESS,
    quoter: ZERO_ADDRESS,
    positionManager: ZERO_ADDRESS,
    poolDeployer: ZERO_ADDRESS,
  },
  {
    version: PROTOCOL_VERSIONS.UNIV3,
    factory: ZERO_ADDRESS,
    swapRouter: ZERO_ADDRESS,
    quoter: ZERO_ADDRESS,
    positionManager: ZERO_ADDRESS,
  },
]

describe('The deployment coherence check', () => {
  describe('when a chain is coherent', () => {
    it('accepts a chain that declares no deployments', () => {
      const chain = buildChain()

      expect(checkDeploymentCoherence(chain)).toEqual([])
    })

    it('accepts a deployment whose version the chain declares', () => {
      const chain = buildChain({ deployments: [COHERENT_V2_ENTRY] })

      expect(checkDeploymentCoherence(chain)).toEqual([])
    })

    it('accepts a real multicall address', () => {
      const chain = buildChain({ multicall: ROUTER })

      expect(checkDeploymentCoherence(chain)).toEqual([])
    })
  })

  describe('when a deployment contradicts the chain', () => {
    it('rejects a version the chain never declares', () => {
      const chain = buildChain({
        deployments: [
          {
            version: PROTOCOL_VERSIONS.V3,
            factory: FACTORY,
            swapRouter: ROUTER,
            quoter: FACTORY,
            positionManager: ROUTER,
            poolDeployer: FACTORY,
          },
        ],
      })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('Test Chain (137)')
      expect(violations[0]).toContain('deployments[0]')
      expect(violations[0]).toContain(PROTOCOL_VERSIONS.V3)
    })

    it('rejects the same version declared twice on one chain', () => {
      const chain = buildChain({ deployments: [COHERENT_V2_ENTRY, COHERENT_V2_ENTRY] })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('deployments[1]')
      expect(violations[0]).toContain(PROTOCOL_VERSIONS.V2)
    })
  })

  describe('when an address slot holds a placeholder', () => {
    it('rejects the all-zero address and names the slot that holds it', () => {
      const chain = buildChain({
        deployments: [{ version: PROTOCOL_VERSIONS.V2, factory: ZERO_ADDRESS, swapRouter: ROUTER }],
      })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('deployments[0].factory')
      expect(violations[0]).toContain(ZERO_ADDRESS)
    })

    it.each([NATIVE_SENTINEL_LOWERCASE, NATIVE_SENTINEL_CHECKSUMMED])(
      'rejects the native-token placeholder written as %s',
      (sentinel) => {
        const chain = buildChain({
          deployments: [{ version: PROTOCOL_VERSIONS.V2, factory: FACTORY, swapRouter: sentinel }],
        })

        const violations = checkDeploymentCoherence(chain)

        expect(violations).toHaveLength(1)
        expect(violations[0]).toContain('deployments[0].swapRouter')
      },
    )

    it('rejects a placeholder multicall address', () => {
      const chain = buildChain({ multicall: ZERO_ADDRESS })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('multicall')
      expect(violations[0]).toContain(ZERO_ADDRESS)
    })

    it('rejects a placeholder multicall even when the chain declares no deployments', () => {
      const chain = buildChain({ multicall: NATIVE_SENTINEL_CHECKSUMMED, deployments: undefined })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(1)
      expect(violations[0]).toContain('multicall')
    })

    it.each(ALL_SENTINEL_ENTRIES)(
      'inspects every address slot the $version family declares',
      (entry) => {
        const chain = buildChain({
          protocols: [{ version: entry.version, exposeDynamicFee: false }],
          deployments: [entry],
        })
        const addressSlotCount = Object.keys(entry).length - 1

        const violations = checkDeploymentCoherence(chain)

        expect(violations).toHaveLength(addressSlotCount)
      },
    )
  })

  describe('when a chain breaks several rules at once', () => {
    it('reports one message per violation', () => {
      const chain = buildChain({
        multicall: ZERO_ADDRESS,
        deployments: [
          COHERENT_V2_ENTRY,
          { version: PROTOCOL_VERSIONS.V2, factory: ZERO_ADDRESS, swapRouter: ROUTER },
        ],
      })

      const violations = checkDeploymentCoherence(chain)

      expect(violations).toHaveLength(3)
    })
  })
})
