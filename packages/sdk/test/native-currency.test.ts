import { ChainId, Currency, WETH, wrappedNative } from '../src'

describe('The native currency', () => {
  describe('on a chain whose gas token is an ERC-20 with no wrapped contract', () => {
    it('describes the gas token so wallets can display balances', () => {
      const native = Currency.ETHER[ChainId.ANUBIS]

      expect(native.symbol).toBe('DAI')
      expect(native.decimals).toBe(18)
    })

    it('exposes no wrapped token', () => {
      expect(WETH[ChainId.ANUBIS]).toBeUndefined()
    })

    it('rejects wrapping instead of returning a phantom token', () => {
      expect(() => wrappedNative(ChainId.ANUBIS)).toThrow('WRAPPED_NATIVE')
    })
  })

  describe('on a chain with a wrapped native token', () => {
    it('resolves the wrapped token for routing', () => {
      const wrapped = wrappedNative(ChainId.ETHEREUM)

      expect(wrapped.chainId).toBe(ChainId.ETHEREUM)
      expect(wrapped.symbol).toBe('WETH')
    })
  })
})
