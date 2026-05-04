# protocol-core — Reference

## Role

Pure protocol metadata for QuickSwap. Exposes the chain registry, protocol version helpers, fee
constants, and token primitives (natives, stablecoins). No on-chain calls, no math libraries.

## Package

`@quickswap-defi/protocol-core` — published with provenance.

## Public exports

- **Registry**: `CHAIN_REGISTRY`, `CHAIN_ID`, `getChain`, `getChainOrThrow`, `getSupportedChainIds`
- **Per-chain configs**: `POLYGON`, `BASE`, `MANTRA`, `MANTA`, `SONEIUM`, `SOMNIA`, `IMX`, `XLAYER`, `ZKEVM`, `DOGECHAIN`, `ETHEREUM`
- **Types**: `ChainConfig`, `ChainProtocolEntry`, `ProtocolVersion`, `SchemaVariant`, `TokenInfo`; constants `PROTOCOL_VERSIONS`, `SCHEMA_VARIANTS`
- **Protocol helpers**: `getSchemaVariant`, `getSupportedVersions`, `getProtocolVersionLabel`
- **Fees**: `V2_FEE_BPS`, `V2_FEE_RATE`, `computeV2Fee`
- **Tokens**: `getNativeToken`, `getWrappedNative`, `getStablecoins`, `getStablecoinAddresses`, `isStablecoin`

## Inputs

- A `chainId: number` for any lookup helper.

## Outputs

- Frozen `ChainConfig` objects, version labels, fee values, token metadata.

## Depends on

- None at runtime. TypeScript-only package.

## Consumed by

- `@quickswap-defi/sdk` (sibling package).
- External consumers (frontends, indexers) that need protocol metadata without trading logic.

## Status

Published. Source of truth for QuickSwap chain configuration.
