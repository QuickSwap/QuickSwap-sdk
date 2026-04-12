import type { ChainConfig } from './types'

export const ZKEVM: ChainConfig = {
  chainId: 1101,
  name: 'Polygon zkEVM',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9',
    symbol: 'WETH',
    decimals: 18,
  },
  protocols: [
    { version: 'v3', hasDynamicFee: false },
    { version: 'univ3', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035', symbol: 'USDC', decimals: 6 },
    { address: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d', symbol: 'USDT', decimals: 6 },
    { address: '0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4', symbol: 'DAI', decimals: 18 },
  ],
}
