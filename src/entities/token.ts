import invariant from 'tiny-invariant'
import { ChainId } from '../constants'
import { validateAndParseAddress } from '../utils'
import { Currency } from './currency'

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Token): boolean {
    // short circuit on reference equality
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }

  /**
   * Returns true if the address of this token sorts before the address of the other token
   * @param other other token to compare
   * @throws if the tokens have the same address
   * @throws if the tokens are on different chains
   */
  public sortsBefore(other: Token): boolean {
    invariant(this.chainId === other.chainId, 'CHAIN_IDS')
    invariant(this.address !== other.address, 'ADDRESSES')
    return this.address.toLowerCase() < other.address.toLowerCase()
  }
}

/**
 * Compares two currencies for equality
 */
export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB)
  } else if (currencyA instanceof Token) {
    return false
  } else if (currencyB instanceof Token) {
    return false
  } else {
    return currencyA === currencyB
  }
}

export const WETH = {
  
  [ChainId.MUMBAI]: new Token(ChainId.MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped Matic'),
  [ChainId.MATIC]: new Token(ChainId.MATIC, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped Matic'),
  [ChainId.DOEGCHAIN_TESTNET]: new Token(ChainId.DOEGCHAIN_TESTNET, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WDOGE', 'Wrapped Doge'),
  [ChainId.DOGECHAIN]: new Token(ChainId.DOGECHAIN, '0xB7ddC6414bf4F5515b52D8BdD69973Ae205ff101', 18, 'WDOGE', 'Wrapped Doge'),
  [ChainId.ZKTESTNET]: new Token(ChainId.ZKTESTNET, '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.ZKEVM]: new Token(ChainId.ZKEVM, '0x4F9A0e7FD2Bf6067db6994CF12E4495Df938E6e9', 18, 'WETH', 'Wrapped Ether'),
  [ChainId.KAVA]: new Token(ChainId.KAVA, '0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b', 18, 'WKAVA', 'Wrapped Kava')
  
}
