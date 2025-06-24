import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MUMBAI = 80001,
  MATIC = 137,
  DOEGCHAIN_TESTNET = 568,
  DOGECHAIN = 2000,
  ZKTESTNET = 1442,
  ZKEVM = 1101,
  KAVA = 2222,
  MANTA = 169,
  ZKATANA = 1261120,
  BTTC = 199,
  X1 = 195,
  TIMX = 13473,
  IMX = 13371,
  ASTARZKEVM = 3776,
  LAYERX = 196,
  ETHEREUM = 1,
  MINATO = 1946,
  SONEIUM = 1868,
  SOMNIA = 50312,
  BASE = 8453,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const FACTORY_ADDRESS = {
  [ChainId.MATIC]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
  [ChainId.DOGECHAIN]: "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F",
  [ChainId.MUMBAI]: "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F",//CHANGE THIS
  [ChainId.ZKEVM]: "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F",//CHANGE THIS
  [ChainId.ZKTESTNET]: "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F",//CHANGE THIS
  [ChainId.DOEGCHAIN_TESTNET]: "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F",//CHANGE THIS
  [ChainId.KAVA]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.MANTA]: "0x8515eC615BcD9dE302fE25419494DeE639f614be",
  [ChainId.ZKATANA]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.BTTC]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.X1]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.TIMX]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.IMX]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.ASTARZKEVM]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.LAYERX]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.ETHEREUM]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.MINATO]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.SONEIUM]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.SOMNIA]: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",//DUMMY
  [ChainId.BASE]: "0xEC6540261aaaE13F236A032d454dc9287E52e56A"
}

export const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
