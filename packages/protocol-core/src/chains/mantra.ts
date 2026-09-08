import type { ChainConfig } from './types'

export const MANTRA: ChainConfig = {
  chainId: 5888,
  name: 'MANTRA',
  nativeSymbol: 'MANTRA',
  wrappedNative: {
    address: '0xE3047710EF6cB36Bcf1E58145529778eA7Cb5598',
    symbol: 'WMANTRA',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', exposeDynamicFee: true },
  ],
  stablecoins: [
    { address: '0xd2b95283011E47257917770D28Bb3EE44c849f6F', symbol: 'mantraUSD', decimals: 18 },
    { address: '0x5E76be0F4e09057D75140216F70fd4cE3365bb29', symbol: 'USDC', decimals: 6 },
    { address: '0x680e8ECB908A2040232ef139A0A52cbE47b9F15B', symbol: 'USDT', decimals: 6 },
    { address: '0x3806640578b710d8480910bF51510bc538d2F51A', symbol: 'USDT_LUCID', decimals: 6 },
  ],
  multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  deployments: [
    {
      version: 'v4',
      factory: '0x10253594A832f967994b44f33411940533302ACb',
      swapRouter: '0x3012E9049d05B4B5369D690114D5A5861EbB85cb',
      quoter: '0x03f8B4b140249Dc7B2503C928E7258CCe1d91F1A',
      positionManager: '0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F',
      poolDeployer: '0xd7cB0E0692f2D55A17bA81c1fE5501D66774fC4A',
    },
  ],
}
