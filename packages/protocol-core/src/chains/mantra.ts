import type { ChainConfig } from './types'

export const MANTRA: ChainConfig = {
  chainId: 5888,
  name: 'MANTRA',
  nativeSymbol: 'OM',
  wrappedNative: {
    address: '0xE3047710EF6cB36Bcf1E58145529778eA7Cb5598',
    symbol: 'WMANTRA',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', hasDynamicFee: true },
  ],
  stablecoins: [
    { address: '0xd2b95283011E47257917770D28Bb3EE44c849f6F', symbol: 'mantraUSD', decimals: 18 },
    { address: '0x5E76be0F4e09057D75140216F70fd4cE3365bb29', symbol: 'USDC', decimals: 6 },
    { address: '0x680e8ECB908A2040232ef139A0A52cbE47b9F15B', symbol: 'USDT', decimals: 6 },
    { address: '0x3806640578b710d8480910bF51510bc538d2F51A', symbol: 'USDT_LUCID', decimals: 6 },
  ],
}
