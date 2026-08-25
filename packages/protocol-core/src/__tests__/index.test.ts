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
import * as publicApi from '../index'
import { SUPPORTED_CHAIN_IDS } from './fixtures/supported-chains'

describe('The public API surface', () => {
  it('publishes the protocol and schema vocabularies', () => {
    expect(PROTOCOL_VERSIONS.V2).toBe('v2')
    expect(SCHEMA_VARIANTS.CONCENTRATED).toBe('concentrated')
  })

  it('publishes the chain registry and its lookups', () => {
    expect(typeof getChain).toBe('function')
    expect(typeof getChainOrThrow).toBe('function')
    expect(typeof getSupportedChainIds).toBe('function')
    expect(CHAIN_REGISTRY).toBeDefined()
    expect(CHAIN_ID).toBeDefined()
  })

  it('publishes one config per supported chain', () => {
    const published = [POLYGON, BASE, MANTRA, MANTA, SONEIUM, SOMNIA, IMX, XLAYER, ETHEREUM]

    expect(published.map(({ chainId }) => chainId)).toEqual([...SUPPORTED_CHAIN_IDS])
  })

  it('publishes the protocol version helpers', () => {
    expect(typeof getSchemaVariant).toBe('function')
    expect(typeof getSupportedVersions).toBe('function')
    expect(typeof getProtocolVersionLabel).toBe('function')
  })

  it('publishes the v2 fee constants', () => {
    expect(V2_FEE_BPS).toBe(30)
    expect(V2_FEE_RATE).toBe(0.003)
    expect(typeof computeV2Fee).toBe('function')
  })

  it('publishes the token helpers', () => {
    expect(typeof getStablecoins).toBe('function')
    expect(typeof getStablecoinAddresses).toBe('function')
    expect(typeof isStablecoin).toBe('function')
    expect(typeof getNativeToken).toBe('function')
    expect(typeof getWrappedNative).toBe('function')
  })

  it('publishes exactly 27 runtime members (types excluded)', () => {
    const runtimeExports = Object.keys(publicApi)

    expect(runtimeExports).toHaveLength(27)
  })
})
