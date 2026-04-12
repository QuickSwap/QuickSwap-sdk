import type { ChainConfig } from './types'

export const BASE: ChainConfig = {
  chainId: 8453,
  name: 'Base',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', hasDynamicFee: true },
    { version: 'v2', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
    { address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', symbol: 'USDT', decimals: 6 },
  ],
}
