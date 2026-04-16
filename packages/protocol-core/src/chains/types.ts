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
}
