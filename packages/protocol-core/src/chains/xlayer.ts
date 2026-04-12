import type { ChainConfig } from './types'

export const XLAYER: ChainConfig = {
  chainId: 196,
  name: 'X-Layer',
  nativeSymbol: 'OKB',
  wrappedNative: {
    address: '0xe538905cf8410324e03A5A23C1c177a474D59b2b',
    symbol: 'WOKB',
    decimals: 18,
  },
  protocols: [
    { version: 'v3', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d', symbol: 'USDT', decimals: 6 },
    { address: '0x74b7F16337b8972027F6196A17a631aC6dE26d22', symbol: 'USDC', decimals: 6 },
    { address: '0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4', symbol: 'DAI', decimals: 18 },
  ],
}
