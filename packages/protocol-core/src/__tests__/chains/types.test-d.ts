import { describe, it, expectTypeOf } from 'vitest'
import {
  PROTOCOL_VERSIONS,
  type ProtocolDeployment,
  type V2Deployment,
  type V3Deployment,
  type V4Deployment,
  type UniV3Deployment,
  type DeploymentFor,
} from '../../chains/types'

const ADDRESS = '0x0000000000000000000000000000000000000001'

describe('The deployment family contract', () => {
  it('gives every family a factory and a swap router', () => {
    expectTypeOf<ProtocolDeployment>().toHaveProperty('factory')
    expectTypeOf<ProtocolDeployment>().toHaveProperty('swapRouter')
  })

  it('hides the quoter until the union is narrowed to one family', () => {
    expectTypeOf<ProtocolDeployment>().not.toHaveProperty('quoter')
  })

  it('limits the v2 family to the contracts a constant-product AMM deploys', () => {
    expectTypeOf<V2Deployment>().toHaveProperty('factory')
    expectTypeOf<V2Deployment>().toHaveProperty('swapRouter')
    expectTypeOf<V2Deployment>().not.toHaveProperty('quoter')
    expectTypeOf<V2Deployment>().not.toHaveProperty('positionManager')
    expectTypeOf<V2Deployment>().not.toHaveProperty('poolDeployer')
  })

  it('requires a pool deployer on both Algebra families', () => {
    expectTypeOf<V3Deployment>().toHaveProperty('poolDeployer')
    expectTypeOf<V4Deployment>().toHaveProperty('poolDeployer')
  })

  it('omits the pool deployer from the Uniswap-V3 fork family', () => {
    expectTypeOf<UniV3Deployment>().toHaveProperty('quoter')
    expectTypeOf<UniV3Deployment>().toHaveProperty('positionManager')
    expectTypeOf<UniV3Deployment>().not.toHaveProperty('poolDeployer')
  })

  it('resolves each protocol version to exactly one family', () => {
    expectTypeOf<DeploymentFor<typeof PROTOCOL_VERSIONS.V2>>().toEqualTypeOf<V2Deployment>()
    expectTypeOf<DeploymentFor<typeof PROTOCOL_VERSIONS.V3>>().toEqualTypeOf<V3Deployment>()
    expectTypeOf<DeploymentFor<typeof PROTOCOL_VERSIONS.V4>>().toEqualTypeOf<V4Deployment>()
    expectTypeOf<DeploymentFor<typeof PROTOCOL_VERSIONS.UNIV3>>().toEqualTypeOf<UniV3Deployment>()
  })

  it('rejects a v3 entry that omits the pool deployer', () => {
    // @ts-expect-error poolDeployer is required on the Algebra v3 family
    const entry: V3Deployment = {
      version: PROTOCOL_VERSIONS.V3,
      factory: ADDRESS,
      swapRouter: ADDRESS,
      quoter: ADDRESS,
      positionManager: ADDRESS,
    }

    expectTypeOf(entry).toEqualTypeOf<V3Deployment>()
  })

  it('rejects a v2 entry that carries a quoter', () => {
    const entry: V2Deployment = {
      version: PROTOCOL_VERSIONS.V2,
      factory: ADDRESS,
      swapRouter: ADDRESS,
      // @ts-expect-error the v2 family deploys no quoter
      quoter: ADDRESS,
    }

    expectTypeOf(entry).toEqualTypeOf<V2Deployment>()
  })
})
