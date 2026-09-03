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
  multicall: '0x69465675e2125414f26ED3139218abBDDe3C4daa',
  deployments: [
    {
      version: 'v4',
      factory: '0x8Ff309F68F6Caf77a78E9C20d2Af7Ed4bE2D7093',
      swapRouter: '0xeba58c20629ddab41e21a3E4E2422E583ebD9719',
      quoter: '0x4c5663252bBAB0a3B303a711823aD70a0ec9aE31',
      positionManager: '0x0629B3c6E1cCfF2e31e3A9Bd67ec96b23BE6f1e9',
      poolDeployer: '0x7B446Bfb3763Ed0892f08893Eb06Dda79aB28CB9',
    },
  ],
}
