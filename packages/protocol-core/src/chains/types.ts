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
  readonly hasDynamicFee: boolean
}

export interface ChainConfig {
  readonly chainId: number
  readonly name: string
  readonly nativeSymbol: string
  readonly wrappedNative: TokenInfo
  readonly protocols: ReadonlyArray<ChainProtocolEntry>
  readonly stablecoins: ReadonlyArray<TokenInfo>
}
