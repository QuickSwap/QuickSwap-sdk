import type { TokenInfo } from '../chains/types'
import { getChain } from '../chains/registry'

/** Lazy cache: chainId → frozen TokenInfo for the native gas token */
const _nativeTokenCache = new Map<number, TokenInfo>()

/**
 * Returns the native gas token info for a chain.
 *
 * The address is the WRAPPED native token address (e.g., WPOL for POL),
 * which is the canonical on-chain address used in analytics, subgraph pricing,
 * and pool lookups.
 *
 * NOTE: Some UI contexts expect the zero address (0x000...0) or a sentinel
 * for native tokens. This function does NOT return those —
 * use the wrapped address for all protocol/analytics operations.
 *
 * The returned object is frozen and cached — subsequent calls for the same
 * chainId return the identical cached reference without re-allocating.
 */
export function getNativeToken(chainId: number): TokenInfo | undefined {
  const cached = _nativeTokenCache.get(chainId)
  if (cached !== undefined) return cached
  const chain = getChain(chainId)
  if (!chain) return undefined
  const token = Object.freeze({
    address: chain.wrappedNative.address,
    symbol: chain.nativeSymbol,
    decimals: chain.wrappedNative.decimals,
  })
  _nativeTokenCache.set(chainId, token)
  return token
}

export function getWrappedNative(chainId: number): TokenInfo | undefined {
  return getChain(chainId)?.wrappedNative
}
