import type { ChainConfig } from './types'

export const BASE: ChainConfig = {
  chainId: 8453,
  name: 'Base',
  nativeSymbol: 'ETH',
  wrappedNative: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', exposeDynamicFee: true },
    { version: 'v2', exposeDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', decimals: 6 },
    { address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', symbol: 'USDT', decimals: 6 },
  ],
  multicall: '0xfEE958Fa595B4478cea7560C91400A98b83d6C91',
  deployments: [
    {
      version: 'v4',
      factory: '0xC5396866754799B9720125B104AE01d935Ab9C7b',
      swapRouter: '0xe6c9bb24ddB4aE5c6632dbE0DE14e3E474c6Cb04',
      quoter: '0xA8a1dA1279ea63535c7B3BE8D20241483BC61009',
      positionManager: '0x84715977598247125C3D6E2e85370d1F6fDA1eaF',
      poolDeployer: '0xE08026Fd8537d67C501199610c42D08bB34eAa75',
    },
    {
      version: 'v2',
      factory: '0xEC6540261aaaE13F236A032d454dc9287E52e56A',
      swapRouter: '0x4a012af2b05616Fb390ED32452641C3F04633bb5',
    },
  ],
}
