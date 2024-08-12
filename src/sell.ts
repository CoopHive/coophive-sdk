import { encodeMessage, Attestation } from './utils'
import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from '@ethereum-attestation-service/eas-sdk'
export const sellSchema: string = "uint256 collateral"

export type SellStruct = {
  collateral: bigint
}

export type SellMessage = [
  collateral: {name: string, value: any, type: string},
]

export type SellParams  = {
  schemaUID: `0x${string}`,
  buyRefUID: `0x${string}`,
  seller: `0x${string}`,
  data: SellStruct
}


const createSellMessage = ({collateral}:{collateral:bigint}): SellMessage => {
  return [
    {name: 'collateral', value: collateral, type: 'uint256'}
  ]
}

const createSellData = ({collateral}:{collateral:bigint}): `0x${string}` => {
  return encodeMessage(sellSchema, createSellMessage({collateral}))
}

export const createSellAttestation = ({
  schemaUID,
  seller,
  collateral,
  buyRefUID
}:{
  schemaUID: `0x${string}`
  seller: `0x${string}`
  collateral: bigint
  buyRefUID: `0x${string}`
}): Attestation => {
  return {
    schema: schemaUID,
    data: {
      recipient: seller,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      refUID: buyRefUID,
      data: createSellData({collateral}),
      value: 0n
    }
  } 
}
