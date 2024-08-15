[**coophive-sdk**](../README.md) • **Docs**

***

[coophive-sdk](../globals.md) / BuyStruct

# Type Alias: BuyStruct

> **BuyStruct**: `object`

## Type declaration

### arbitrationDeadline

> **arbitrationDeadline**: `bigint`

The deadline for the arbiter to confirm the sanctity of the transaction, the arbiter will be slashed if the deadline is exceeded

### collateralRequested

> **collateralRequested**: `bigint`

The amount of collateral the buyer desires the supplier posts to incentivize correct completion of the job

### creditsRequested

> **creditsRequested**: `bigint`

The number of credits requested, credits are stored offchain in a trusted manner and consumed in querymaking

### jobCost

> **jobCost**: `bigint`

The cost of the job in wei, to be paid to the supplier upon successful mediation

### jobDeadline

> **jobDeadline**: `bigint`

The deadline the job is active, the final time the job must be completed and results posted to not be slashed

### offerDeadline

> **offerDeadline**: `bigint`

The deadline this offer is active, agreements on this attestation cannot be made after this deadline

### paymentToken

> **paymentToken**: `string`

The erc20 token used to pay for the job

### supplier

> **supplier**: \`0x$\{string\}\`

The public ethereum address of the desired counterparty

## Defined in

[src/buy.ts:18](https://github.com/CoopHive/coophive-sdk/blob/cfd0d3f7ead89762749d2fff704f01ea6070d919/src/buy.ts#L18)
