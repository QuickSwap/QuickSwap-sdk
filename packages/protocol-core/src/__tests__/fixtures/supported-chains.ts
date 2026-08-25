// Canonical set of chains this package is expected to expose.
// Hand-maintained on purpose: tests pin production against this list rather
// than deriving it from the registry, which would make them tautological.
export const SUPPORTED_CHAINS = [
  { key: 'POLYGON', chainId: 137 },
  { key: 'BASE', chainId: 8453 },
  { key: 'MANTRA', chainId: 5888 },
  { key: 'MANTA', chainId: 169 },
  { key: 'SONEIUM', chainId: 1868 },
  { key: 'SOMNIA', chainId: 5031 },
  { key: 'IMX', chainId: 13371 },
  { key: 'XLAYER', chainId: 196 },
  { key: 'ETHEREUM', chainId: 1 },
] as const

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map(({ chainId }) => chainId)

export const SUPPORTED_CHAIN_KEYS = SUPPORTED_CHAINS.map(({ key }) => key)

const byValue = (a: number, b: number) => a - b

export const sortedChainIds = (ids: ReadonlyArray<number>) => [...ids].sort(byValue)
