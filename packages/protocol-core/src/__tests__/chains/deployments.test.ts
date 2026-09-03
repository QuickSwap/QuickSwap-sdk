import { describe, it, expect } from 'vitest'
import { getDeployment } from '../../chains/deployments'
import { PROTOCOL_VERSIONS, type ProtocolVersion } from '../../chains/types'

const POLYGON_ID = 137
const MANTA_ID = 169
const IMX_ID = 13371
const ETHEREUM_ID = 1
const UNREGISTERED_ID = 99999

const BASE_ID = 8453
const MANTRA_ID = 5888
const SONEIUM_ID = 1868
const SOMNIA_ID = 5031
const XLAYER_ID = 196

interface DeploymentFixture {
  readonly label: string
  readonly chainId: number
  readonly version: ProtocolVersion
  readonly addresses: Readonly<Record<string, string>>
}

/**
 * Exact address per chain, version and role. Deployed addresses are immutable,
 * so any diff here is either a transcription error or a genuine redeploy.
 */
const DEPLOYMENT_FIXTURES: ReadonlyArray<DeploymentFixture> = [
  {
    label: 'Base v4',
    chainId: BASE_ID,
    version: PROTOCOL_VERSIONS.V4,
    addresses: {
      factory: '0xC5396866754799B9720125B104AE01d935Ab9C7b',
      swapRouter: '0xe6c9bb24ddB4aE5c6632dbE0DE14e3E474c6Cb04',
      quoter: '0xA8a1dA1279ea63535c7B3BE8D20241483BC61009',
      positionManager: '0x84715977598247125C3D6E2e85370d1F6fDA1eaF',
      poolDeployer: '0xE08026Fd8537d67C501199610c42D08bB34eAa75',
    },
  },
  {
    label: 'Base v2',
    chainId: BASE_ID,
    version: PROTOCOL_VERSIONS.V2,
    addresses: {
      factory: '0xEC6540261aaaE13F236A032d454dc9287E52e56A',
      swapRouter: '0x4a012af2b05616Fb390ED32452641C3F04633bb5',
    },
  },
  {
    label: 'MANTRA v4',
    chainId: MANTRA_ID,
    version: PROTOCOL_VERSIONS.V4,
    addresses: {
      factory: '0x10253594A832f967994b44f33411940533302ACb',
      swapRouter: '0x3012E9049d05B4B5369D690114D5A5861EbB85cb',
      quoter: '0x03f8B4b140249Dc7B2503C928E7258CCe1d91F1A',
      positionManager: '0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F',
      poolDeployer: '0xd7cB0E0692f2D55A17bA81c1fE5501D66774fC4A',
    },
  },
  {
    label: 'Soneium v4',
    chainId: SONEIUM_ID,
    version: PROTOCOL_VERSIONS.V4,
    addresses: {
      factory: '0x8Ff309F68F6Caf77a78E9C20d2Af7Ed4bE2D7093',
      swapRouter: '0xeba58c20629ddab41e21a3E4E2422E583ebD9719',
      quoter: '0x4c5663252bBAB0a3B303a711823aD70a0ec9aE31',
      positionManager: '0x0629B3c6E1cCfF2e31e3A9Bd67ec96b23BE6f1e9',
      poolDeployer: '0x7B446Bfb3763Ed0892f08893Eb06Dda79aB28CB9',
    },
  },
  {
    label: 'Somnia v4',
    chainId: SOMNIA_ID,
    version: PROTOCOL_VERSIONS.V4,
    addresses: {
      factory: '0x0ccff3D02A3a200263eC4e0Fdb5E60a56721B8Ae',
      swapRouter: '0x1582f6f3D26658F7208A799Be46e34b1f366CE44',
      quoter: '0xd86C6620300f59f3C6566b3Fb9269674fd5c5264',
      positionManager: '0xfE02219e0578B1E4831CDE7C3CB36f71AEb4A833',
      poolDeployer: '0x0361B4883FfD676BB0a4642B3139D38A33e452f5',
    },
  },
  {
    // X Layer's quoter address is also Polygon's wrapped-native address. One
    // deployer at one nonce produces the same address on both chains, so the
    // literal is shared while the contracts behind it are unrelated.
    label: 'X Layer v3',
    chainId: XLAYER_ID,
    version: PROTOCOL_VERSIONS.V3,
    addresses: {
      factory: '0xd2480162Aa7F02Ead7BF4C127465446150D58452',
      swapRouter: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
      quoter: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      positionManager: '0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd',
      poolDeployer: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
    },
  },
]

const FIXTURE_FIELDS = DEPLOYMENT_FIXTURES.flatMap(({ label, chainId, version, addresses }) =>
  Object.entries(addresses).map(([field, address]) => ({ label, chainId, version, field, address })),
)

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

  describe('when a chain carries a backfilled entry', () => {
    it.each(FIXTURE_FIELDS)(
      'hands back the recorded $label $field',
      ({ chainId, version, field, address }) => {
        const deployment = getDeployment(chainId, version)

        expect(deployment).toHaveProperty(field, address)
      },
    )
  })
})
