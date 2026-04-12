import type { ChainConfig } from './types'

export const MANTA: ChainConfig = {
  chainId: 169,
  name: 'Manta Pacific',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0x0Dc808adcE2099A9F62AA87D9670745AbA741746',
    symbol: 'WETH',
    decimals: 18,
  },
  protocols: [
    { version: 'univ3', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0xb73603C5d87fA094B7314C74ACE2e64D165016fb', symbol: 'USDC', decimals: 6 },
    { address: '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f', symbol: 'USDT', decimals: 6 },
    { address: '0x1c466b9371f8aBA0D7c458bE10a62192Fcb8Aa71', symbol: 'DAI', decimals: 18 },
  ],
}
