import { describe, it, expect } from 'vitest'
import { getSupportedVersions, getProtocolVersionLabel } from '../../protocol/versions'

describe('protocol/versions', () => {
  describe('getSupportedVersions', () => {
    it('returns [v3, v2] for Polygon (137)', () => {
      expect(getSupportedVersions(137)).toEqual(['v3', 'v2'])
    })

    it('returns [v4, v2] for Base (8453)', () => {
      expect(getSupportedVersions(8453)).toEqual(['v4', 'v2'])
    })

    it('returns [v4] for MANTRA (5888)', () => {
      expect(getSupportedVersions(5888)).toEqual(['v4'])
    })

    it('returns [univ3] for Manta (169)', () => {
      expect(getSupportedVersions(169)).toEqual(['univ3'])
    })

    it('returns [] for Ethereum (1) — aggregation only', () => {
      expect(getSupportedVersions(1)).toEqual([])
    })

    it('returns [] for unknown chain', () => {
      expect(getSupportedVersions(99999)).toEqual([])
    })
  })

  describe('getProtocolVersionLabel', () => {
    it('returns v4 for Base CL', () => {
      expect(getProtocolVersionLabel(8453, true)).toBe('v4')
    })

    it('returns v3 for Polygon CL', () => {
      expect(getProtocolVersionLabel(137, true)).toBe('v3')
    })

    it('returns univ3 for Manta CL', () => {
      expect(getProtocolVersionLabel(169, true)).toBe('univ3')
    })

    it('returns v2 when not concentrated liquidity', () => {
      expect(getProtocolVersionLabel(137, false)).toBe('v2')
    })

    it('returns v3 as fallback for unknown chain CL', () => {
      expect(getProtocolVersionLabel(99999, true)).toBe('v3')
    })

    it('returns v2 for Ethereum (no protocols)', () => {
      expect(getProtocolVersionLabel(1, true)).toBe('v3') // fallback — Ethereum has no CL protocol
    })
  })
})
