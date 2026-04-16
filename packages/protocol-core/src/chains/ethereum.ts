import type { ChainConfig } from './types'

export const ETHEREUM: ChainConfig = {
  chainId: 1,
  name: 'Ethereum',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WETH',
    decimals: 18,
  },
  // No QuickSwap deployment — reference chain for cross-chain price feeds and stablecoin addresses
  protocols: [],
  stablecoins: [
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18 },
  ],
}
