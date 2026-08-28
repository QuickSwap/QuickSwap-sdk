# Flow — Chain onboarding

How to add a new EVM chain to the SDK so consumers can use it.

## Where artifacts live

No dedicated sequence diagram for this flow. The architecture diagram in the root
[README](../../README.md#architecture) shows the container layout.

## Steps

1. **protocol-core — chain config.** Create `packages/protocol-core/src/chains/<chain>.ts`
   exporting a `ChainConfig` with chain id, name, native symbol, wrapped native, supported
   protocol versions, and stablecoin list. Add the chain-level `multicall` address and one
   `deployments` entry per protocol version the chain runs. Both fields are optional, but a
   chain without `deployments` resolves to `undefined` from `getDeployment`.
2. **protocol-core — registry.** Import and register the new config in
   `packages/protocol-core/src/chains/registry.ts` (both `_registry` and `CHAIN_ID`).
3. **protocol-core — barrel.** Re-export the new chain config from
   `packages/protocol-core/src/index.ts`.
4. **sdk — ChainId enum.** Add an entry to the `ChainId` enum in
   `packages/sdk/src/constants.ts`.
5. **sdk — factory address.** Add the chain's V2 factory address to the `FACTORY_ADDRESS` map.
   Until the address is finalized, leave the entry under onboarding rather than publishing.
6. **Tests.** Add or update tests in `packages/protocol-core/test/` and `packages/sdk/test/` to
   cover the new chain.
7. **Build and lint.** Run `pnpm -r build` and `pnpm -r lint` to confirm both packages compile.

## Inputs

- Chain id, native + wrapped native metadata, stablecoin list, multicall address, and the
  contract addresses each protocol version deploys — factory and swap router for every family,
  plus quoter, position manager and pool deployer where that family declares them.

## Outputs

- A new chain that is enumerable via `getSupportedChainIds()` and usable from `Token` / `Pair`.

## Audience

SDK maintainers onboarding a new deployment.
