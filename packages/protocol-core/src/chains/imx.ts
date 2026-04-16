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
}
