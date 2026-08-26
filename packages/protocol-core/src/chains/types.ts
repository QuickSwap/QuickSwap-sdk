export const PROTOCOL_VERSIONS = {
  V2: 'v2',
  V3: 'v3',
  V4: 'v4',
  UNIV3: 'univ3',
} as const

export type ProtocolVersion = (typeof PROTOCOL_VERSIONS)[keyof typeof PROTOCOL_VERSIONS]

export const SCHEMA_VARIANTS = {
  V2: 'v2',
  CONCENTRATED: 'concentrated',
} as const

export type SchemaVariant = (typeof SCHEMA_VARIANTS)[keyof typeof SCHEMA_VARIANTS]

export interface TokenInfo {
  readonly address: string
  readonly symbol: string
  readonly decimals: number
}

export interface ChainProtocolEntry {
  readonly version: ProtocolVersion
  /**
   * Whether the subgraph schema for this protocol version exposes a `dynamicFee`
   * field on Pool entities. True for V4 (Algebra Integral), false for V3/V2/UniV3.
   *
   * This is a subgraph schema capability flag, NOT a protocol-level indicator of
   * whether the AMM uses adaptive fees (Algebra V3 pools DO use dynamic fees at
   * the protocol level, but the V3 subgraph schema does not expose the field).
   */
  readonly exposeDynamicFee: boolean
}

export interface ChainConfig {
  readonly chainId: number
  readonly name: string
  readonly nativeSymbol: string
  readonly wrappedNative: TokenInfo
  readonly protocols: ReadonlyArray<ChainProtocolEntry>
  readonly stablecoins: ReadonlyArray<TokenInfo>
  /** Aggregator contract used to batch read calls. Version-agnostic. */
  readonly multicall?: string
  readonly deployments?: ReadonlyArray<ProtocolDeployment>
}

interface DeploymentBase {
  readonly factory: string
  readonly swapRouter: string
}

interface ConcentratedDeploymentBase extends DeploymentBase {
  readonly quoter: string
  readonly positionManager: string
}

/**
 * V2 pairs are fungible ERC20 tokens priced by closed-form constant-product
 * math, so this family deploys no quoter and no position manager.
 */
export interface V2Deployment extends DeploymentBase {
  readonly version: typeof PROTOCOL_VERSIONS.V2
}

export interface V3Deployment extends ConcentratedDeploymentBase {
  readonly version: typeof PROTOCOL_VERSIONS.V3
  /** Algebra derives pool addresses from this contract rather than from `factory`. */
  readonly poolDeployer: string
}

export interface V4Deployment extends ConcentratedDeploymentBase {
  readonly version: typeof PROTOCOL_VERSIONS.V4
  /** Algebra derives pool addresses from this contract rather than from `factory`. */
  readonly poolDeployer: string
}

/** Uniswap-V3 fork family: pools are derived from `factory`, so no pool deployer exists. */
export interface UniV3Deployment extends ConcentratedDeploymentBase {
  readonly version: typeof PROTOCOL_VERSIONS.UNIV3
}

export type ProtocolDeployment = V2Deployment | V3Deployment | V4Deployment | UniV3Deployment

/** Narrows `ProtocolDeployment` to the single family matching a protocol version. */
export type DeploymentFor<V extends ProtocolVersion> = Extract<ProtocolDeployment, { version: V }>
