# QuickSwap SDK — Overview

## What

The QuickSwap SDK is a pnpm monorepo that publishes two TypeScript packages for working with
QuickSwap's V2 (Uniswap V2-fork) deployments across multiple EVM chains. `protocol-core` exposes
chain configuration, protocol versions, fees, and token primitives. `sdk` builds on top of it
with the trading entities, fetcher, and router.

```mermaid
graph TB
    accTitle: QuickSwap SDK system context
    accDescr { The SDK is consumed by dApp frontends and backend indexers. It reads pair reserves and token metadata from EVM chains via ethers v5. }
    subgraph PEOPLE["Consumers"]
        ACTOR_1["dApp / Frontend<br/><i>Swap UIs, aggregators</i>"]
        ACTOR_2["Backend / Indexer<br/><i>Analytics, off-chain services</i>"]
    end

    SYSTEM[["QuickSwap SDK<br/><b>V2 entities + multi-chain protocol metadata</b>"]]

    subgraph EXT["External Systems"]
        EXT_1["EVM Chains<br/><i>Polygon, Base, zkEVM, others</i>"]
        EXT_2["ethers v5<br/><i>RPC provider library</i>"]
    end

    ACTOR_1 -->|"imports entities, builds trades"| SYSTEM
    ACTOR_2 -->|"imports chain registry"| SYSTEM
    SYSTEM <-->|"reads pair reserves and token metadata"| EXT_1
    SYSTEM -->|"uses provider for on-chain reads"| EXT_2

    classDef system fill:#4a1f6e,stroke:#9b59b6,color:#f0e6ff,font-weight:bold
    classDef external fill:#1e3a2f,stroke:#27ae60,color:#d5f5e3
    classDef person fill:#3d2b1f,stroke:#e67e22,color:#fdebd0

    class SYSTEM system
    class EXT_1,EXT_2 external
    class ACTOR_1,ACTOR_2 person
```

## Why

Consumers have very different needs. A frontend that only renders chain names and stablecoin
addresses has no reason to pull in JSBI, ethers, and the V2 math. A swap UI does. Splitting the
project into a base metadata package and a trading SDK keeps each install minimal and lets the
two evolve on independent release cycles.

## Core principle

**One concern per package.** `protocol-core` is pure data and helpers — no on-chain calls, no
math libraries. `sdk` is the V2 trading layer — entities, pricing, and reserve fetching. The
boundary is enforced by the dependency direction: `sdk` depends on `protocol-core`, never the
other way around.

## Packages

| Package | Role | Human analogue |
|---|---|---|
| `@quickswap-defi/protocol-core` | Chain registry, fees, stablecoins, natives | The atlas — knows where things are |
| `@quickswap-defi/sdk` | V2 entities, pair math, trade construction | The calculator — knows what to do with them |

## How they work together

1. **Look up the chain** — pick a chain from the registry, read its protocol versions and tokens.
2. **Build the trade** — use the SDK's `Token`, `Pair`, `Route`, and `Trade` to compute outputs.

Full sequence in [flows/trade-execution.md](./flows/trade-execution.md). Container view in the
root [README](../README.md#architecture).

## Multi-chain support

The chain registry is the single source of truth for which networks the SDK supports and what
their on-chain configuration looks like. See [`packages/protocol-core/`](../packages/protocol-core/)
for the export surface and [glossary.md](./glossary.md) for the underlying concepts (`ChainId`,
`Factory`, `Init Code Hash`).
