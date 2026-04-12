import type { TokenInfo } from '../chains/types'
import { getChain } from '../chains/registry'

export function getStablecoins(chainId: number): ReadonlyArray<TokenInfo> {
  return getChain(chainId)?.stablecoins ?? []
}

export function getStablecoinAddresses(chainId: number): string[] {
  return getStablecoins(chainId).map((t) => t.address.toLowerCase())
}

/** Lazy cache: chainId → Set of lowercase stablecoin addresses */
const _stablecoinSetCache = new Map<number, Set<string>>()

function getStablecoinSet(chainId: number): Set<string> {
  const cached = _stablecoinSetCache.get(chainId)
  if (cached !== undefined) return cached
  const set = new Set(getStablecoinAddresses(chainId))
  _stablecoinSetCache.set(chainId, set)
  return set
}

export function isStablecoin(chainId: number, address: string): boolean {
  return getStablecoinSet(chainId).has(address.toLowerCase())
}
