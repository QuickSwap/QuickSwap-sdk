# ADR 001 — Split protocol-core from the trading SDK

- **Status:** Accepted
- **Date:** 2026-05-04

## Context

The original SDK was a single package: V2 entities, pricing math, on-chain fetcher, and chain
configuration all shipped together. Two different consumer profiles emerged:

- Trading consumers (swap UIs, aggregators) need everything — entities, math, fetcher.
- Metadata consumers (frontends listing chains, indexers, analytics) only need the chain
  registry, fees, and stablecoin lists. They have no use for JSBI, ethers, or V2 math.

Bundling everything together meant the metadata consumers paid for the entire trading layer.
Releases were also coupled: a chain registry update forced an SDK release, and an SDK math fix
forced a registry release.

## Decision

Split the monorepo into two packages:

- `@quickswap-defi/protocol-core` — chains, fees, token primitives, version helpers. Zero
  runtime dependencies.
- `@quickswap-defi/sdk` — V2 entities, fetcher, router. Depends on `protocol-core` and the
  ethers peer set.

Dependency direction is one-way: `sdk` depends on `protocol-core`, never the reverse.

## Consequences

- Metadata consumers install a tiny package with no runtime dependencies.
- Trading consumers get the same surface they had before, plus an explicit dependency edge.
- Each package versions independently. A chain config change does not bump the SDK.
- The boundary needs to be enforced in code review — V2 math must not leak into `protocol-core`.
- New chains are added in `protocol-core` first, then surfaced in `sdk` (see
  `docs/flows/chain-onboarding.md`).
