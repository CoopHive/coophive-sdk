[**coophive-sdk**](../README.md) • **Docs**

***

[coophive-sdk](../globals.md) / BuyStruct

# Type Alias: BuyStruct

> **BuyStruct**: `object`

Typescript object description of the buySchema

## Type declaration

### arbitrationDeadline

> **arbitrationDeadline**: `bigint`

### collateralRequested

> **collateralRequested**: `bigint`

### creditsRequested

> **creditsRequested**: `bigint`

### jobCost

> **jobCost**: `bigint`

### jobDeadline

> **jobDeadline**: `bigint`

### offerDeadline

> **offerDeadline**: `bigint`

### paymentToken

> **paymentToken**: `string`

### supplier

> **supplier**: \`0x$\{string\}\`

## Param

The public ethereum address of the desired counterparty, who is selling the resource you are requesting to buy

## Param

The cost of the job in wei, to be paid to the supplier upon successful mediation

## Param

The erc20 token used to pay for the job

## Param

The number of credits requested, credits are stored offchain in a trusted manner and consumed in querymaking

## Param

The amount of collateral the buyer desire the supplier posts to incentivize correct completion of the job

## Param

The deadline this offer is active, agreements on this attestation cannot be made after this deadline

## Param

The deadline the job is active, the final time the job must be completed and results posted to not be slashed

## Param

The deadline for the arbiter to confirm the sanctity of the transaction, the arbiter will be slashed if the deadline is exceeded

## Defined in

[src/buy.ts:29](https://github.com/CoopHive/coophive-sdk/blob/0566794b0d4e977b07da040496c8b6dca5eb89e3/src/buy.ts#L29)
