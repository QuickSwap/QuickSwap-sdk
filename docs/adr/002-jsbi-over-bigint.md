# ADR 002 — Use JSBI instead of native BigInt

- **Status:** Accepted
- **Date:** 2026-05-04

## Context

V2 pricing math operates on token reserves and amounts that exceed `Number.MAX_SAFE_INTEGER`.
The SDK needs an integer type with arbitrary precision.

Two options:

- Native `BigInt` — built into modern engines, fastest, no dependency.
- `JSBI` — userland BigInt polyfill, uniform API across runtimes.

The SDK was originally forked from Uniswap's V2 SDK, which standardized on JSBI when native
`BigInt` had inconsistent support across browsers and Node versions targeted by dApps. JSBI's
API mirrors the eventual native one, so a future migration is mostly mechanical.

## Decision

Use JSBI throughout the SDK. Re-export `JSBI` from `@quickswap-defi/sdk` so consumers can build
amounts (`JSBI.BigInt('1000000000000000000')`) without adding their own dependency.

Continue accepting `BigintIsh = JSBI | bigint | string` at public API boundaries so consumers
who prefer native `BigInt` can pass it in.

## Consequences

- Consistent math API across every runtime the SDK targets.
- A small bundle cost from the JSBI dependency.
- Slight performance gap versus native `BigInt`, acceptable for typical swap-sized math.
- A future ADR may revisit this once native `BigInt` is the universal default and the
  migration cost is justified.
- Consumers can mix JSBI and native `BigInt` at the boundary via `BigintIsh`.
