import type { ChainConfig } from './types'
import { POLYGON } from './polygon'
import { BASE } from './base'
import { MANTRA } from './mantra'
import { MANTA } from './manta'
import { SONEIUM } from './soneium'
import { SOMNIA } from './somnia'
import { IMX } from './imx'
import { XLAYER } from './xlayer'
import { ZKEVM } from './zkevm'
import { DOGECHAIN } from './dogechain'
import { ETHEREUM } from './ethereum'

function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj)
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value)
    }
  }
  return obj as Readonly<T>
}

const _registry: Record<number, ChainConfig> = {
  [POLYGON.chainId]: POLYGON,
  [BASE.chainId]: BASE,
  [MANTRA.chainId]: MANTRA,
  [MANTA.chainId]: MANTA,
  [SONEIUM.chainId]: SONEIUM,
  [SOMNIA.chainId]: SOMNIA,
  [IMX.chainId]: IMX,
  [XLAYER.chainId]: XLAYER,
  [ZKEVM.chainId]: ZKEVM,
  [DOGECHAIN.chainId]: DOGECHAIN,
  [ETHEREUM.chainId]: ETHEREUM,
}

export const CHAIN_REGISTRY: Readonly<Record<number, ChainConfig>> = deepFreeze(_registry)

export function getChain(chainId: number): ChainConfig | undefined {
  return CHAIN_REGISTRY[chainId]
}

export function getSupportedChainIds(): number[] {
  return Object.keys(CHAIN_REGISTRY).map(Number)
}
