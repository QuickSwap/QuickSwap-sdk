<p align="center">
  <strong>QuickSwap SDK</strong><br>
  <em>TypeScript building blocks for QuickSwap V2 trading and multi-chain protocol metadata.</em>
</p>

<p align="center">
  <a href="docs/overview.md">Overview</a> &bull;
  <a href="#packages">Packages</a> &bull;
  <a href="docs/flows/">Flows</a> &bull;
  <a href="docs/glossary.md">Glossary</a> &bull;
  <a href="docs/adr/">ADRs</a>
</p>

---

> Trade entities, pricing math, and chain configuration — published as two focused npm packages.

A pnpm monorepo with two packages: `@quickswap-defi/protocol-core` (chain registry, versions,
stablecoins, fees) and `@quickswap-defi/sdk` (Uniswap V2-fork entities, fetcher, router).
Consumers pick metadata only, or the full trading toolkit on top of it.

## Packages

| Package | Role | Status |
|---|---|---|
| [`@quickswap-defi/protocol-core`](packages/protocol-core/) | Chain configs, protocol versions, fees, native + stablecoin metadata | Published |
| [`@quickswap-defi/sdk`](packages/sdk/) | V2 entities (`Token`, `Pair`, `Route`, `Trade`), fetcher, router | Published |

## Architecture

```mermaid
graph TB
    accTitle: QuickSwap SDK container architecture
    accDescr { Two packages — protocol-core (chain registry, fees, tokens) and sdk (V2 entities, fetcher, router) — sit inside the QuickSwap SDK monorepo. Consumers import sdk, sdk depends on protocol-core, ethers v5 is a peer dependency, JSBI provides BigInt math, and sdk reads pair reserves from EVM chains. }
    subgraph EXTERNAL["External"]
        CONSUMER["dApp / Consumer<br/><i>Imports the SDK</i>"]
        ETHERS["ethers v5<br/><i>Peer dependency</i>"]
        JSBI_LIB["JSBI<br/><i>BigInt polyfill</i>"]
        CHAIN["EVM Chain RPC<br/><i>On-chain reads</i>"]
    end

    subgraph SYSTEM["QuickSwap SDK monorepo"]
        subgraph PACKAGES["Packages"]
            CORE["@quickswap-defi/protocol-core<br/><i>Chains, fees, tokens, versions</i>"]
            SDK["@quickswap-defi/sdk<br/><i>V2 entities, fetcher, router</i>"]
        end
    end

    CONSUMER -->|"imports"| SDK
    CONSUMER -->|"imports (metadata only)"| CORE
    SDK -->|"depends on"| CORE
    SDK -->|"peer dep"| ETHERS
    SDK -->|"depends on"| JSBI_LIB
    SDK -->|"reads via provider"| CHAIN

    classDef entity fill:#4a1f6e,stroke:#9b59b6,color:#f0e6ff,font-weight:bold
    classDef infra fill:#1a3a5c,stroke:#2e86c1,color:#d6eaf8
    classDef external fill:#1e3a2f,stroke:#27ae60,color:#d5f5e3

    class CORE,SDK entity
    class ETHERS,JSBI_LIB infra
    class CONSUMER,CHAIN external
```

## How It Works

1. **Resolve chain metadata** — read chain config and addresses from `protocol-core`.
2. **Build entities** — instantiate `Token`s, fetch `Pair` reserves, construct a `Route`.
3. **Compute the trade** — derive `Trade` outputs, slippage bounds, and execution params.

Full sequence → [docs/flows/trade-execution.md](docs/flows/trade-execution.md).

## Install

```bash
pnpm add @quickswap-defi/sdk @quickswap-defi/protocol-core
pnpm add @ethersproject/address @ethersproject/contracts @ethersproject/providers @ethersproject/networks @ethersproject/solidity
```

## Stack

| Component | Purpose |
|---|---|
| TypeScript 5 (strict) | Source language |
| tsup | CJS + ESM dual build with `.d.ts` |
| Vitest 2 | Test runner |
| ESLint 9 | Lint (flat config) |
| JSBI | BigInt math |
| ethers v5 | Peer dependency for on-chain reads |

## Documentation

Documentation follows [Diátaxis](https://diataxis.fr/) — each doc stays in its lane.

| Doc | Type | Description |
|-----|------|-------------|
| [Overview](docs/overview.md) | Explanation | What the SDK is and why the split exists |
| [Packages](#packages) | Reference | Per-package READMEs (also published to npm) |
| [Flows](docs/flows/) | Explanation | Trade execution and chain onboarding |
| [Glossary](docs/glossary.md) | Reference | Domain terms |
| [ADRs](docs/adr/) | Decisions | Architecture decision records |

## Development

```bash
pnpm install
pnpm -r build
pnpm -r test
pnpm -r lint
```

## License

MIT.
