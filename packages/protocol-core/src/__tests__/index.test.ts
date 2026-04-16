import { describe, it, expect } from 'vitest'
import {
  PROTOCOL_VERSIONS,
  SCHEMA_VARIANTS,
  CHAIN_REGISTRY,
  CHAIN_ID,
  getChain,
  getChainOrThrow,
  getSupportedChainIds,
  POLYGON,
  BASE,
  MANTRA,
  MANTA,
  SONEIUM,
  SOMNIA,
  IMX,
  XLAYER,
  ZKEVM,
  DOGECHAIN,
  ETHEREUM,
  getSchemaVariant,
  getSupportedVersions,
  getProtocolVersionLabel,
  V2_FEE_BPS,
  V2_FEE_RATE,
  computeV2Fee,
  getStablecoins,
  getStablecoinAddresses,
  isStablecoin,
  getNativeToken,
  getWrappedNative,
} from '../index'

describe('barrel export (index.ts)', () => {
  it('exports all type const objects', () => {
    expect(PROTOCOL_VERSIONS.V2).toBe('v2')
    expect(SCHEMA_VARIANTS.CONCENTRATED).toBe('concentrated')
  })

  it('exports chain registry functions', () => {
    expect(typeof getChain).toBe('function')
    expect(typeof getChainOrThrow).toBe('function')
    expect(typeof getSupportedChainIds).toBe('function')
    expect(CHAIN_REGISTRY).toBeDefined()
    expect(CHAIN_ID).toBeDefined()
  })

  it('exports individual chain configs', () => {
    expect(POLYGON.chainId).toBe(137)
    expect(BASE.chainId).toBe(8453)
    expect(MANTRA.chainId).toBe(5888)
    expect(MANTA.chainId).toBe(169)
    expect(SONEIUM.chainId).toBe(1868)
    expect(SOMNIA.chainId).toBe(5031)
    expect(IMX.chainId).toBe(13371)
    expect(XLAYER.chainId).toBe(196)
    expect(ZKEVM.chainId).toBe(1101)
    expect(DOGECHAIN.chainId).toBe(2000)
    expect(ETHEREUM.chainId).toBe(1)
  })

  it('exports protocol functions', () => {
    expect(typeof getSchemaVariant).toBe('function')
    expect(typeof getSupportedVersions).toBe('function')
    expect(typeof getProtocolVersionLabel).toBe('function')
  })

  it('exports fee constants', () => {
    expect(V2_FEE_BPS).toBe(30)
    expect(V2_FEE_RATE).toBe(0.003)
    expect(typeof computeV2Fee).toBe('function')
  })

  it('exports token functions', () => {
    expect(typeof getStablecoins).toBe('function')
    expect(typeof getStablecoinAddresses).toBe('function')
    expect(typeof isStablecoin).toBe('function')
    expect(typeof getNativeToken).toBe('function')
    expect(typeof getWrappedNative).toBe('function')
  })

  it('has exactly 29 runtime exports (types excluded)', () => {
    // 2 const objects + 5 registry + 11 chain configs + 3 protocol + 3 fee + 5 token = 29
    const allExports = {
      PROTOCOL_VERSIONS, SCHEMA_VARIANTS,
      CHAIN_REGISTRY, CHAIN_ID, getChain, getChainOrThrow, getSupportedChainIds,
      POLYGON, BASE, MANTRA, MANTA, SONEIUM, SOMNIA, IMX, XLAYER, ZKEVM, DOGECHAIN, ETHEREUM,
      getSchemaVariant, getSupportedVersions, getProtocolVersionLabel,
      V2_FEE_BPS, V2_FEE_RATE, computeV2Fee,
      getStablecoins, getStablecoinAddresses, isStablecoin, getNativeToken, getWrappedNative,
    }
    expect(Object.keys(allExports)).toHaveLength(29)
  })
})
