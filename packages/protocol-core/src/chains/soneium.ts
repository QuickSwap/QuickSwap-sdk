import type { ChainConfig } from './types'

export const SONEIUM: ChainConfig = {
  chainId: 1868,
  name: 'Soneium',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', exposeDynamicFee: true },
  ],
  stablecoins: [
    { address: '0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369', symbol: 'USDC', decimals: 6 },
    { address: '0x3A337a6adA9d885b6Ad95ec48F9b75f197b5AE35', symbol: 'USDT', decimals: 6 },
  ],
}
