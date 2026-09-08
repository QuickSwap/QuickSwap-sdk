import type { ChainConfig } from './types'

export const SOMNIA: ChainConfig = {
  chainId: 5031,
  name: 'Somnia',
  nativeSymbol: 'SOMI',
  wrappedNative: {
    address: '0x046EDe9564A72571df6F5e44d0405360c0f4dCab',
    symbol: 'WSOMI',
    decimals: 18,
  },
  protocols: [
    { version: 'v4', exposeDynamicFee: true },
  ],
  stablecoins: [
    { address: '0x28BEc7E30E6faee657a03e19Bf1128AaD7632A00', symbol: 'USDC', decimals: 6 },
    { address: '0x67B302E35Aef5EEE8c32D934F5856869EF428330', symbol: 'USDT', decimals: 6 },
  ],
  multicall: '0x5e44F178E8cF9B2F5409B6f18ce936aB817C5a11',
  deployments: [
    {
      version: 'v4',
      factory: '0x0ccff3D02A3a200263eC4e0Fdb5E60a56721B8Ae',
      swapRouter: '0x1582f6f3D26658F7208A799Be46e34b1f366CE44',
      quoter: '0xd86C6620300f59f3C6566b3Fb9269674fd5c5264',
      positionManager: '0xfE02219e0578B1E4831CDE7C3CB36f71AEb4A833',
      poolDeployer: '0x0361B4883FfD676BB0a4642B3139D38A33e452f5',
    },
  ],
}
