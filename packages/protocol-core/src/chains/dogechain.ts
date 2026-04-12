import type { ChainConfig } from './types'

// NOTE: DAI address (0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C) is Dogechain's own DAI token.
// Do NOT use zkEVM's DAI (0xC5015b9d9161Dca7e18e32f6f25C4aD850731Fd4) — interface-v3 has a bug
// referencing DAI[ChainId.ZKEVM] for Dogechain.
export const DOGECHAIN: ChainConfig = {
  chainId: 2000,
  name: 'Dogechain',
  nativeSymbol: 'DOGE',
  wrappedNative: {
    address: '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101',
    symbol: 'WWDOGE',
    decimals: 18,
  },
  protocols: [
    { version: 'v3', hasDynamicFee: false },
    { version: 'v2', hasDynamicFee: false },
  ],
  stablecoins: [
    { address: '0x765277EebeCA2e31912C9946eAe1021199B39C61', symbol: 'USDC', decimals: 6 },
    { address: '0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D', symbol: 'USDT', decimals: 6 },
    { address: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C', symbol: 'DAI', decimals: 18 },
  ],
}
