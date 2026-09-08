/** Longest run of endpoint-supplied text kept in a report line. */
export const MAX_REASON_LENGTH = 200

const NON_PRINTING_RE = /[\p{Cc}\p{Cf}]/gu
const WHITESPACE_RUN_RE = /\s+/g

/**
 * Renders endpoint-supplied text for a terminal: non-printing characters become
 * spaces, runs of whitespace collapse to one, every occurrence of `secret` is
 * masked, and the result is capped at `MAX_REASON_LENGTH` characters.
 */
export function sanitiseReason(text: string, secret?: string): string {
  const masked = secret === undefined || secret === '' ? text : text.split(secret).join('***')
  const printable = masked.replace(NON_PRINTING_RE, ' ').replace(WHITESPACE_RUN_RE, ' ').trim()
  if (printable.length <= MAX_REASON_LENGTH) return printable
  return `${printable.slice(0, MAX_REASON_LENGTH - 1)}…`
}
