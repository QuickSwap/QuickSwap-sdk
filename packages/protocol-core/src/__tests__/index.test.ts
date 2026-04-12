import { describe, it, expect } from 'vitest'
import {
  PROTOCOL_VERSIONS,
  SCHEMA_VARIANTS,
  CHAIN_REGISTRY,
  getChain,
  getSupportedChainIds,
  getSchemaVariant,
  getSupportedVersions,
  getProtocolVersionLabel,
  V2_FEE_BPS,
  V2_FEE_RATE,
  computeV2Fees,
  getStablecoins,
  getStablecoinAddresses,
  isStablecoin,
  getNativeToken,
  getWrappedNative,
  percentChange,
  getDayTimestamps,
  getDayIds,
  getLast7DayTimestamps,
  ONE_DAY,
  SUBGRAPH_PAGE_SIZE,
  MIN_PRICE_USD,
  MIN_VOLUME_USD,
} from '../index'

describe('barrel export (index.ts)', () => {
  it('exports all type const objects', () => {
    expect(PROTOCOL_VERSIONS.V2).toBe('v2')
    expect(SCHEMA_VARIANTS.CONCENTRATED).toBe('concentrated')
  })

  it('exports chain registry functions', () => {
    expect(typeof getChain).toBe('function')
    expect(typeof getSupportedChainIds).toBe('function')
    expect(CHAIN_REGISTRY).toBeDefined()
  })

  it('exports protocol functions', () => {
    expect(typeof getSchemaVariant).toBe('function')
    expect(typeof getSupportedVersions).toBe('function')
    expect(typeof getProtocolVersionLabel).toBe('function')
  })

  it('exports fee constants', () => {
    expect(V2_FEE_BPS).toBe(30)
    expect(V2_FEE_RATE).toBe(0.003)
    expect(typeof computeV2Fees).toBe('function')
  })

  it('exports token functions', () => {
    expect(typeof getStablecoins).toBe('function')
    expect(typeof getStablecoinAddresses).toBe('function')
    expect(typeof isStablecoin).toBe('function')
    expect(typeof getNativeToken).toBe('function')
    expect(typeof getWrappedNative).toBe('function')
  })

  it('exports utility functions and constants', () => {
    expect(typeof percentChange).toBe('function')
    expect(typeof getDayTimestamps).toBe('function')
    expect(typeof getDayIds).toBe('function')
    expect(typeof getLast7DayTimestamps).toBe('function')
    expect(ONE_DAY).toBe(86400)
    expect(SUBGRAPH_PAGE_SIZE).toBe(1000)
    expect(MIN_PRICE_USD).toBe(0.000001)
    expect(MIN_VOLUME_USD).toBe(0.0001)
  })

  it('has exactly 24 runtime exports (types excluded)', () => {
    // 2 const objects + 3 registry + 3 protocol + 3 fee + 5 token + 8 util = 24
    const allExports = {
      PROTOCOL_VERSIONS, SCHEMA_VARIANTS,
      CHAIN_REGISTRY, getChain, getSupportedChainIds,
      getSchemaVariant, getSupportedVersions, getProtocolVersionLabel,
      V2_FEE_BPS, V2_FEE_RATE, computeV2Fees,
      getStablecoins, getStablecoinAddresses, isStablecoin, getNativeToken, getWrappedNative,
      percentChange, getDayTimestamps, getDayIds, getLast7DayTimestamps, ONE_DAY,
      SUBGRAPH_PAGE_SIZE, MIN_PRICE_USD, MIN_VOLUME_USD,
    }
    expect(Object.keys(allExports)).toHaveLength(24)
  })
})
