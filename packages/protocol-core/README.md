# @quickswap-defi/protocol-core

> Pure protocol metadata for QuickSwap — chain registry, protocol versions, fees, native and stablecoin token info. No on-chain calls, no math libraries.

Part of the [QuickSwap-sdk monorepo](https://github.com/QuickSwap/QuickSwap-sdk).

## Install

```bash
pnpm add @quickswap-defi/protocol-core
```

## Quickstart

```ts
import {
  getChainOrThrow,
  getSupportedChainIds,
  computeV2Fee,
  getStablecoins,
  getNativeToken,
} from '@quickswap-defi/protocol-core'

const polygon = getChainOrThrow(137)
const chains = getSupportedChainIds()
const native = getNativeToken(137)
const stables = getStablecoins(137)

const feeAmount = computeV2Fee(1_000_000n) // V2 swap fee in raw units
```

## Public API

- **Registry** — `CHAIN_REGISTRY`, `CHAIN_ID`, `getChain`, `getChainOrThrow`, `getSupportedChainIds`
- **Per-chain configs** — `POLYGON`, `BASE`, `MANTRA`, `MANTA`, `SONEIUM`, `SOMNIA`, `IMX`, `XLAYER`, `ZKEVM`, `DOGECHAIN`, `ETHEREUM`
- **Types** — `ChainConfig`, `ChainProtocolEntry`, `ProtocolVersion`, `SchemaVariant`, `TokenInfo`
- **Constants** — `PROTOCOL_VERSIONS`, `SCHEMA_VARIANTS`
- **Protocol helpers** — `getSchemaVariant`, `getSupportedVersions`, `getProtocolVersionLabel`
- **Fees** — `V2_FEE_BPS`, `V2_FEE_RATE`, `computeV2Fee`
- **Tokens** — `getNativeToken`, `getWrappedNative`, `getStablecoins`, `getStablecoinAddresses`, `isStablecoin`

## Runtime dependencies

None. TypeScript-only package.

## Consumed by

- [`@quickswap-defi/sdk`](../sdk/) — sibling package that builds the trading layer on top.
- External consumers (frontends, indexers, analytics) that need protocol metadata without trading logic.

## Status

Published with provenance.

## Documentation

- [Monorepo overview](../../docs/overview.md)
- [Glossary](../../docs/glossary.md)
- [Chain onboarding flow](../../docs/flows/chain-onboarding.md)
- [ADR 001 — protocol-core split](../../docs/adr/001-protocol-core-split.md)

## License

MIT.
