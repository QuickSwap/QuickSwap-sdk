# Flow — Chain onboarding

How to add a new EVM chain to the SDK so consumers can use it.

## Where artifacts live

No dedicated sequence diagram for this flow. The architecture diagram in the root
[README](../../README.md#architecture) shows the container layout.

## Steps

1. **protocol-core — chain config.** Create `packages/protocol-core/src/chains/<chain>.ts`
   exporting a `ChainConfig` with chain id, name, native token, wrapped native, supported
   protocol versions, schema variant, and stablecoin list.
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

- Chain id, factory deployment address, native + wrapped native metadata, stablecoin list.

## Outputs

- A new chain that is enumerable via `getSupportedChainIds()` and usable from `Token` / `Pair`.

## Audience

SDK maintainers onboarding a new deployment.
