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
    { version: 'v4', hasDynamicFee: true },
  ],
  stablecoins: [
    { address: '0x28BEc7E30E6faee657a03e19Bf1128AaD7632A00', symbol: 'USDC', decimals: 6 },
    { address: '0x67B302E35Aef5EEE8c32D934F5856869EF428330', symbol: 'USDT', decimals: 6 },
  ],
}
