import { describe, it, expect } from 'vitest'
import { getDeployment } from '../../chains/deployments'
import { PROTOCOL_VERSIONS } from '../../chains/types'

const POLYGON_ID = 137
const MANTA_ID = 169
const IMX_ID = 13371
const ETHEREUM_ID = 1
const UNREGISTERED_ID = 99999

describe('The deployment lookup', () => {
  describe('when no entry can satisfy the request', () => {
    it('finds nothing on an unregistered chain', () => {
      const deployment = getDeployment(UNREGISTERED_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment).toBeUndefined()
    })

    it('finds nothing on a chain that declares no deployments', () => {
      const deployment = getDeployment(ETHEREUM_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment).toBeUndefined()
    })

    it.each(Object.values(PROTOCOL_VERSIONS))(
      'finds no %s entry on a chain that declares no deployments',
      (version) => {
        const deployment = getDeployment(ETHEREUM_ID, version)

        expect(deployment).toBeUndefined()
      },
    )

    it.each([PROTOCOL_VERSIONS.V4, PROTOCOL_VERSIONS.UNIV3])(
      'finds no %s entry on Polygon, which does not deploy that family',
      (version) => {
        const deployment = getDeployment(POLYGON_ID, version)

        expect(deployment).toBeUndefined()
      },
    )
  })

  describe('when the chain declares the requested version', () => {
    it('hands back the Algebra v3 entry Polygon declares', () => {
      const deployment = getDeployment(POLYGON_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment?.version).toBe(PROTOCOL_VERSIONS.V3)
      expect(deployment?.factory).toBe('0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28')
    })

    it('hands back the v2 entry Polygon declares', () => {
      const deployment = getDeployment(POLYGON_ID, PROTOCOL_VERSIONS.V2)

      expect(deployment?.version).toBe(PROTOCOL_VERSIONS.V2)
      expect(deployment?.factory).toBe('0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32')
    })

    it('reaches the Algebra pool deployer through a v3 lookup', () => {
      const deployment = getDeployment(POLYGON_ID, PROTOCOL_VERSIONS.V3)

      expect(deployment?.poolDeployer).toBe('0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92')
    })
  })

  describe('when two chains run different protocol families', () => {
    it('hands back the Uniswap-V3 fork entry Manta Pacific declares', () => {
      const deployment = getDeployment(MANTA_ID, PROTOCOL_VERSIONS.UNIV3)

      expect(deployment?.version).toBe(PROTOCOL_VERSIONS.UNIV3)
      expect(deployment?.quoter).toBe('0x3005827fB92A0cb7D0f65738D6D645d98A4Ad96b')
    })

    it('hands back the Uniswap-V3 fork entry Immutable zkEVM declares', () => {
      const deployment = getDeployment(IMX_ID, PROTOCOL_VERSIONS.UNIV3)

      expect(deployment?.version).toBe(PROTOCOL_VERSIONS.UNIV3)
      expect(deployment?.quoter).toBe('0xE9CC37904875B459Fa5D0FE37680d36F1ED55e38')
    })

    it('keeps the Algebra and Uniswap-V3 fork quoters apart across chains', () => {
      const algebra = getDeployment(POLYGON_ID, PROTOCOL_VERSIONS.V3)
      const uniswapFork = getDeployment(MANTA_ID, PROTOCOL_VERSIONS.UNIV3)

      expect(algebra?.quoter).toBe('0xa15F0D7377B2A0C0c10db057f641beD21028FC89')
      expect(uniswapFork?.quoter).toBe('0x3005827fB92A0cb7D0f65738D6D645d98A4Ad96b')
    })
  })
})
