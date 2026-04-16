import type { ProtocolVersion } from '../chains/types'
import { getChain } from '../chains/registry'

export function getSupportedVersions(chainId: number): ProtocolVersion[] {
  const chain = getChain(chainId)
  if (!chain) return []
  return chain.protocols.map((p) => p.version)
}

export function getProtocolVersionLabel(chainId: number, isConcentratedLiquidity: boolean): string {
  if (!isConcentratedLiquidity) return 'v2'
  const chain = getChain(chainId)
  if (!chain) return 'v3'
  const clProtocol = chain.protocols.find((p) => p.version !== 'v2')
  return clProtocol?.version ?? 'v3'
}
