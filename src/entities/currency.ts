import JSBI from 'jsbi'
import { ChainId } from '../constants'
import { SolidityType } from '../constants'
import { validateSolidityTypeInstance } from '../utils'

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
export class Currency {
  public readonly decimals: number
  public readonly symbol?: string
  public readonly name?: string

  /**
   * The only instance of the base class `Currency`.
   */

  public static readonly ETHER = {
    [ChainId.MUMBAI]: new Currency(18, 'MATIC', 'Matic'),
    [ChainId.MATIC]: new Currency(18, 'POL', 'Polygon Ecosystem Token'),
    [ChainId.DOEGCHAIN_TESTNET]: new Currency(18, 'WDOGE', 'Wrapped Doge'),
    [ChainId.DOGECHAIN]: new Currency(18, 'WDOGE', 'Wrapped Doge'),
    [ChainId.ZKTESTNET]: new Currency(18, 'ETH', 'Ether'),
    [ChainId.ZKEVM]: new Currency(18, 'ETH', 'Ether'),
    [ChainId.KAVA]: new Currency(18, 'KAVA', 'KAVA'),
    [ChainId.MANTA]: new Currency(18, 'ETH', 'Ether'),
    [ChainId.ZKATANA]: new Currency(18, 'ETH', 'Ether'),
    [ChainId.BTTC]: new Currency(18, 'BTT', 'Bit Torrent'),
    [ChainId.X1]: new Currency(18, 'OKB', 'OKB'),
    [ChainId.TIMX]: new Currency(18, 'IMX', 'IMX'),
    [ChainId.IMX]: new Currency(18, 'IMX', 'IMX'),
    [ChainId.ASTARZKEVM]: new Currency(18, 'ETH', 'Ether'),
    [ChainId.LAYERX]: new Currency(18, 'OKB', 'OKB'),
    [ChainId.ETHEREUM]: new Currency(18, 'ETH', 'Ether'),
  }

  /**
   * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
   * @param decimals decimals of the currency
   * @param symbol symbol of the currency
   * @param name of the currency
   */
  protected constructor(decimals: number, symbol?: string, name?: string) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8)

    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }
}

const ETHER = Currency.ETHER
export { ETHER }
