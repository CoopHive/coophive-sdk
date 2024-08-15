[**coophive-sdk**](../README.md) • **Docs**

***

[coophive-sdk](../globals.md) / Attestation

# Type Alias: Attestation

> **Attestation**: `object`

## Type declaration

### data

> **data**: `object`

the data used in the attestation

### data.data

> **data**: \`0x$\{string\}\`

the data used in the attestation

### data.expirationTime

> **expirationTime**: `bigint`

the expiration time of the attestation

### data.recipient

> **recipient**: \`0x$\{string\}\`

the recipient of the attestation, should be same as attestor

### data.refUID

> **refUID**: \`0x$\{string\}\`

the refUID of the attestation, chains the attestations together

### data.revocable

> **revocable**: `Boolean`

whether the attestation is revocable, should be true

### data.value

> **value**: `bigint`

the value of the attestation, if supplied ether

### schema

> **schema**: \`0x$\{string\}\`

the schema used in the attestation

## Defined in

[src/utils.ts:15](https://github.com/CoopHive/coophive-sdk/blob/cfd0d3f7ead89762749d2fff704f01ea6070d919/src/utils.ts#L15)
