import { describe, it, expect, expectTypeOf } from 'vitest'
import {
  PROTOCOL_VERSIONS,
  SCHEMA_VARIANTS,
  type ProtocolVersion,
  type SchemaVariant,
  type TokenInfo,
  type ChainProtocolEntry,
  type ChainConfig,
} from '../../chains/types'

describe('chains/types', () => {
  describe('ProtocolVersion', () => {
    it('accepts valid values', () => {
      const v2: ProtocolVersion = PROTOCOL_VERSIONS.V2
      const v3: ProtocolVersion = PROTOCOL_VERSIONS.V3
      const v4: ProtocolVersion = PROTOCOL_VERSIONS.V4
      const univ3: ProtocolVersion = PROTOCOL_VERSIONS.UNIV3
      expect(v2).toBe('v2')
      expect(v3).toBe('v3')
      expect(v4).toBe('v4')
      expect(univ3).toBe('univ3')
    })

    it('has exactly 4 entries', () => {
      expect(Object.keys(PROTOCOL_VERSIONS)).toHaveLength(4)
    })
  })

  describe('SchemaVariant', () => {
    it('accepts valid values', () => {
      const v2: SchemaVariant = SCHEMA_VARIANTS.V2
      const concentrated: SchemaVariant = SCHEMA_VARIANTS.CONCENTRATED
      expect(v2).toBe('v2')
      expect(concentrated).toBe('concentrated')
    })

    it('has exactly 2 entries', () => {
      expect(Object.keys(SCHEMA_VARIANTS)).toHaveLength(2)
    })
  })

  describe('TokenInfo', () => {
    it('is a flat interface with 3 fields', () => {
      const token: TokenInfo = { address: '0x123', symbol: 'TEST', decimals: 18 }
      expect(Object.keys(token)).toHaveLength(3)
    })
  })

  describe('ChainConfig', () => {
    it('has readonly protocols as ReadonlyArray', () => {
      const config: ChainConfig = {
        chainId: 1,
        name: 'Test',
        nativeSymbol: 'ETH',
        wrappedNative: { address: '0x123', symbol: 'WETH', decimals: 18 },
        protocols: [],
        stablecoins: [],
      }
      expectTypeOf(config.protocols).toEqualTypeOf<ReadonlyArray<ChainProtocolEntry>>()
      expectTypeOf(config.stablecoins).toEqualTypeOf<ReadonlyArray<TokenInfo>>()
    })
  })
})
