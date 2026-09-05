import { describe, it, expect } from 'vitest'
import { MAX_REASON_LENGTH, sanitiseReason } from '../../verification/text'

/** ESC, the byte that opens a terminal control sequence. */
const ESC = String.fromCharCode(0x1b)
/** A zero-width format character. */
const ZERO_WIDTH = String.fromCharCode(0x200b)

describe('verification/text', () => {
  describe('sanitiseReason', () => {
    it('keeps ordinary text unchanged', () => {
      expect(sanitiseReason('eth_call: HTTP 429')).toBe('eth_call: HTTP 429')
    })

    it('replaces terminal escape sequences with spaces', () => {
      expect(sanitiseReason(`before${ESC}[31mred${ESC}[0mafter`)).toBe('before [31mred [0mafter')
    })

    it('replaces newlines, tabs and carriage returns with a single space', () => {
      expect(sanitiseReason('one\n\ttwo\r\n\r\nthree')).toBe('one two three')
    })

    it('strips a zero-width format character', () => {
      expect(sanitiseReason(`a${ZERO_WIDTH}b`)).toBe('a b')
    })

    it('trims surrounding whitespace', () => {
      expect(sanitiseReason('  padded  ')).toBe('padded')
    })

    it('caps the result at MAX_REASON_LENGTH characters', () => {
      const result = sanitiseReason('a'.repeat(MAX_REASON_LENGTH * 2))

      expect(result).toHaveLength(MAX_REASON_LENGTH)
      expect(result.endsWith('…')).toBe(true)
    })

    it('leaves text at exactly MAX_REASON_LENGTH intact', () => {
      const exact = 'a'.repeat(MAX_REASON_LENGTH)
      expect(sanitiseReason(exact)).toBe(exact)
    })

    it('masks every occurrence of the secret', () => {
      expect(sanitiseReason('dkey=abc123 retried with dkey=abc123', 'abc123')).toBe(
        'dkey=*** retried with dkey=***',
      )
    })

    it('ignores an empty secret', () => {
      expect(sanitiseReason('nothing to mask', '')).toBe('nothing to mask')
    })
  })
})
