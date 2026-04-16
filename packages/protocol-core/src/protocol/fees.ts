/** V2 swap fee in basis points (0.30%) */
export const V2_FEE_BPS = 30

/** V2 swap fee as a decimal rate (30 BPS = 0.003) */
export const V2_FEE_RATE = 0.003

/**
 * Compute the V2 fee amount for a given input amount.
 *
 * @param amountIn - The input token amount (as a plain JS number)
 * @returns The fee amount as a JS number
 *
 * WARNING: This function uses standard IEEE-754 floating-point arithmetic.
 * It is intended ONLY for display/analytics approximations (e.g., "~$0.03 fee").
 * Do NOT use the result for on-chain-accurate calculations — for that, use
 * integer/BigInt arithmetic with the raw token amounts and apply the 0.30% fee
 * in full-precision basis-point math (amountIn * 30 / 10_000).
 */
export function computeV2Fee(amountIn: number): number {
  return amountIn * V2_FEE_RATE
}
