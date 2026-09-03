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
    { version: 'v3', exposeDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x1E4a5963aBFD975d8c9021ce480b42188849D41d', symbol: 'USDT', decimals: 6 },
    { address: '0x74b7F16337b8972027F6196A17a631aC6dE26d22', symbol: 'USDC', decimals: 6 },
    { address: '0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4', symbol: 'DAI', decimals: 18 },
  ],
  multicall: '0xc7efb32470dEE601959B15f1f923e017C6A918cA',
  deployments: [
    {
      version: 'v3',
      factory: '0xd2480162Aa7F02Ead7BF4C127465446150D58452',
      swapRouter: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
      quoter: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      positionManager: '0xF6Ad3CcF71Abb3E12beCf6b3D2a74C963859ADCd',
      poolDeployer: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
    },
  ],
}
