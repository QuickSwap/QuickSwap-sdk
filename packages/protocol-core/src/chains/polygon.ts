import type { ChainConfig } from './types'

export const POLYGON: ChainConfig = {
  chainId: 137,
  name: 'Polygon PoS',
  nativeSymbol: 'POL',
  wrappedNative: {
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    symbol: 'WPOL',
    decimals: 18,
  },
  protocols: [
    { version: 'v3', exposeDynamicFee: false },
    { version: 'v2', exposeDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC.e', decimals: 6 },
    { address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', symbol: 'USDC', decimals: 6 },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6 },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', decimals: 18 },
  ],
  multicall: '0x6ccb9426CeceE2903FbD97fd833fD1D31c100292',
  deployments: [
    {
      version: 'v3',
      factory: '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28',
      swapRouter: '0xf5b509bB0909a69B1c207E495f687a596C168E12',
      quoter: '0xa15F0D7377B2A0C0c10db057f641beD21028FC89',
      positionManager: '0x8eF88E4c7CfbbaC1C163f7eddd4B578792201de6',
      poolDeployer: '0x2D98E2FA9da15aa6dC9581AB097Ced7af697CB92',
    },
    {
      version: 'v2',
      factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
      swapRouter: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    },
  ],
}
