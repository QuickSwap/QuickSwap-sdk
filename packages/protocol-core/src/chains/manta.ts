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
    { version: 'univ3', exposeDynamicFee: false },
  ],
  stablecoins: [
    { address: '0xb73603C5d87fA094B7314C74ACE2e64D165016fb', symbol: 'USDC', decimals: 6 },
    { address: '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f', symbol: 'USDT', decimals: 6 },
    { address: '0x1c466b9371f8aBA0D7c458bE10a62192Fcb8Aa71', symbol: 'DAI', decimals: 18 },
  ],
  multicall: '0x1FD671daC06DF1431E79d772037E93bdB2dfeb48',
  deployments: [
    {
      version: 'univ3',
      factory: '0x56c2162254b0E4417288786eE402c2B41d4e181e',
      swapRouter: '0xfdE3eaC61C5Ad5Ed617eB1451cc7C3a0AC197564',
      quoter: '0x3005827fB92A0cb7D0f65738D6D645d98A4Ad96b',
      positionManager: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    },
  ],
}
