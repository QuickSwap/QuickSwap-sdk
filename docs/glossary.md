# Glossary

One term per `##` heading. Two-to-four sentences max per term.

## ChainId

Numeric identifier of an EVM network (e.g. Polygon = 137, Base = 8453). The SDK exposes a
`ChainId` enum and `protocol-core` exposes a `CHAIN_ID` map keyed by name.

## Token

ERC20 representation: chain id, address, decimals, optional symbol and name. Used as the basic
unit for pairs, routes, and trades.

## Currency

Base type that abstracts over a `Token` and a chain's native asset. Anything you can hold or
trade is a `Currency`.

## Pair

A liquidity pool between two `Token`s. Holds reserves and exposes pricing helpers and the math
to derive output amounts from inputs.

## Route

An ordered list of `Pair`s connecting an input `Currency` to an output `Currency`. Routes can be
multi-hop.

## Trade

A computed swap: input amount, output amount, route, price impact, and the params needed to
execute on-chain.

## CurrencyAmount

A `Currency` paired with a quantity, expressed as a fraction over the currency's decimals.

## TokenAmount

A `CurrencyAmount` whose currency is specifically a `Token` (not a native asset).

## Fraction

Lossless rational number (`numerator / denominator`) used for all internal pricing math to avoid
floating-point error.

## Percent

A `Fraction` interpreted as a percentage. Used for slippage tolerance and price impact.

## Price

A `Fraction` of one `Currency` denominated in another. Derived from `Pair` reserves.

## Factory

The on-chain V2 factory contract address per chain. Combined with `INIT_CODE_HASH` to
deterministically compute pair addresses.

## Init Code Hash

The keccak256 hash of the pair contract's init code. Used in `CREATE2` to derive the address of
a pair without an on-chain call.

## JSBI

JavaScript BigInt polyfill. The SDK uses JSBI throughout for cross-runtime BigInt math.
