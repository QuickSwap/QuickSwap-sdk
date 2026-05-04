# Flow — Trade execution

How a consumer turns input amounts into a `Trade` with the params needed to execute on-chain.

## Sequence

```mermaid
sequenceDiagram
    accTitle: Trade execution sequence
    accDescr { Consumer builds Token instances, fetches the Pair via the Pair Fetcher, constructs a Route, instantiates a Trade (exactIn or exactOut), reads slippage bounds, and submits router calldata. }
    autonumber
    actor C as Consumer
    participant F as Pair Fetcher
    participant R as Route
    participant T as Trade

    C->>C: build Token instances (in, out)
    C->>F: fetchPairData(tokenA, tokenB, provider)
    F->>F: derive pair address (factory + init code hash)
    F-->>C: Pair (with reserves)

    C->>R: new Route([pair, ...], input, output)
    R-->>C: Route

    alt EXACT_INPUT
        C->>T: Trade.exactIn(route, inputAmount)
    else EXACT_OUTPUT
        C->>T: Trade.exactOut(route, outputAmount)
    end
    T-->>C: Trade (inputAmount, outputAmount, priceImpact)

    C->>T: minimumAmountOut(slippage) / maximumAmountIn(slippage)
    T-->>C: bound CurrencyAmount

    Note over C: Format router calldata, sign, and submit
```

## Steps

1. **Consumer** builds `Token` instances for the input and output currencies. Each `Token`
   carries its chain id, address, and decimals.
2. **Consumer** asks the **Fetcher** for the `Pair` between the two tokens. The fetcher derives
   the pair address (factory + init code hash) and reads reserves from chain via the ethers
   provider.
3. **Consumer** constructs a **Route** from the input currency through one or more pairs to the
   output currency. Single-hop routes use one pair; multi-hop routes chain pairs together.
4. **Consumer** instantiates a **Trade**:
   - `Trade.exactIn(route, inputAmount)` — fix the input, derive the output.
   - `Trade.exactOut(route, outputAmount)` — fix the output, derive the input.
5. **Consumer** picks a slippage `Percent` and reads the bounds:
   - `trade.minimumAmountOut(slippage)` for `EXACT_INPUT`.
   - `trade.maximumAmountIn(slippage)` for `EXACT_OUTPUT`.
6. **Consumer** uses the `Router` helpers to format calldata for the swap, then signs and sends
   it through the ethers signer.

## Inputs

- `Token` instances on the same chain.
- An ethers v5 provider.
- A user-chosen slippage tolerance.

## Outputs

- A `Trade` with `inputAmount`, `outputAmount`, `route`, `priceImpact`, and `executionPrice`.
- Router calldata for on-chain execution.

## Audience

SDK consumers building swap UIs, aggregators, or back-office tools.
