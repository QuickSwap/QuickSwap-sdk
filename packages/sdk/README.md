# @quickswap-defi/sdk

> Uniswap V2-fork trading SDK for QuickSwap — `Token`, `Pair`, `Route`, `Trade` entities, fraction-based pricing math, on-chain reserve fetcher, and router calldata helpers.

Part of the [QuickSwap-sdk monorepo](https://github.com/QuickSwap/QuickSwap-sdk).

## Install

```bash
pnpm add @quickswap-defi/sdk @quickswap-defi/protocol-core
pnpm add @ethersproject/address @ethersproject/contracts @ethersproject/providers \
         @ethersproject/networks @ethersproject/solidity
```

`ethers v5` packages are peer dependencies.

## Quickstart

```ts
import {
  ChainId,
  Token,
  Fetcher,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} from '@quickswap-defi/sdk'

const USDC = new Token(ChainId.MATIC, '0x2791...', 6, 'USDC', 'USD Coin')
const WMATIC = new Token(ChainId.MATIC, '0x0d50...', 18, 'WMATIC', 'Wrapped Matic')

const pair = await Fetcher.fetchPairData(USDC, WMATIC, provider)
const route = new Route([pair], WMATIC)
const trade = new Trade(route, new TokenAmount(WMATIC, '1000000000000000000'), TradeType.EXACT_INPUT)

const slippage = new Percent('50', '10000') // 0.5%
const minOut = trade.minimumAmountOut(slippage)
```

## Public API

- **Entities** — `Token`, `Currency`, `Pair`, `Route`, `Trade`
- **Fractions** — `Fraction`, `Percent`, `Price`, `CurrencyAmount`, `TokenAmount`
- **Constants** — `ChainId`, `TradeType`, `Rounding`, `FACTORY_ADDRESS`, `INIT_CODE_HASH`, `MINIMUM_LIQUIDITY`, `JSBI`
- **Fetcher** — on-chain reserve reads via ethers provider
- **Router** — swap calldata builders
- **Errors** — typed error classes for invariant violations

## Dependencies

- [`@quickswap-defi/protocol-core`](../protocol-core/) — sibling, chain registry and protocol metadata.
- `jsbi`, `big.js`, `decimal.js-light`, `tiny-invariant`, `tiny-warning`, `toformat`.
- `@ethersproject/*` v5 — peer dependencies.

## Status

Published with provenance.

## Documentation

- [Monorepo overview](../../docs/overview.md)
- [Glossary](../../docs/glossary.md)
- [Trade execution flow](../../docs/flows/trade-execution.md)
- [ADRs](../../docs/adr/)

## License

MIT.
