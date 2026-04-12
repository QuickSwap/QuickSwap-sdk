import type { ChainConfig } from './types'

export const POLYGON: ChainConfig = {
  chainId: 137,
  name: 'Polygon PoS',
  nativeSymbol: 'POL',
  wrappedNative: {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    symbol: 'WMATIC',
    decimals: 18,
  },
  protocols: [
    { version: 'v3', hasDynamicFee: false },
    { version: 'v2', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC.e', decimals: 6 },
    { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', symbol: 'USDC', decimals: 6 },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6 },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', decimals: 18 },
  ],
}
