import type { ChainConfig } from './types'

export const IMX: ChainConfig = {
  chainId: 13371,
  name: 'Immutable zkEVM',
  nativeSymbol: 'IMX',
  wrappedNative: {
    address: '0x3A0C2Ba54D6CBd3121F01b96dFd20e99D1696C9D',
    symbol: 'WIMX',
    decimals: 18,
  },
  protocols: [
    { version: 'univ3', exposeDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x6de8aCC0D406837030CE4dd28e7c08C5a96a30d2', symbol: 'USDC', decimals: 6 },
    { address: '0x68bcc7F1190AF20e7b572BCfb431c3Ac10A936Ab', symbol: 'USDT', decimals: 6 },
    { address: '0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a', symbol: 'AUSD', decimals: 6 },
    { address: '0xEB466342C4d449BC9f53A865D5Cb90586f405215', symbol: 'axlUSDC', decimals: 6 },
  ],
  multicall: '0xc7efb32470dEE601959B15f1f923e017C6A918cA',
  deployments: [
    {
      version: 'univ3',
      factory: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
      swapRouter: '0x6c28AeF8977c9B773996d0e8376d2EE379446F2f',
      quoter: '0xE9CC37904875B459Fa5D0FE37680d36F1ED55e38',
      positionManager: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    },
  ],
}
