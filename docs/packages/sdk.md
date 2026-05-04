# sdk — Reference

## Role

Uniswap V2-fork trading SDK for QuickSwap. Provides the entity model (`Token`, `Pair`, `Route`,
`Trade`), fraction-based pricing math, an on-chain reserve fetcher, and router helpers for
building swap calldata.

## Package

`@quickswap-defi/sdk` — published with provenance.

## Public exports

- **Entities**: `Token`, `Currency`, `Pair`, `Route`, `Trade`
- **Fractions**: `Fraction`, `Percent`, `Price`, `CurrencyAmount`, `TokenAmount`
- **Constants**: `ChainId`, `TradeType`, `Rounding`, `FACTORY_ADDRESS`, `INIT_CODE_HASH`, `MINIMUM_LIQUIDITY`, `BigintIsh`, `JSBI`
- **Fetcher / Router / Errors**: on-chain reads, swap calldata builders, typed error classes

## Inputs

- `Token` definitions (chain id, address, decimals).
- An ethers v5 provider for on-chain fetcher calls.
- Trade parameters (input/output amounts, slippage, deadline).

## Outputs

- `Trade` instances with execution params, derived bounds, and price impact.
- Router calldata ready to be sent to the V2 router contract.

## Depends on

- `@quickswap-defi/protocol-core` (sibling package).
- `jsbi`, `big.js`, `decimal.js-light`, `tiny-invariant`, `tiny-warning`, `toformat`.
- ethers v5 (`@ethersproject/*`) — peer dependencies.

## Status

Published. Tested with Vitest in `packages/sdk/test/`.
