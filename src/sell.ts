import { encodeMessage, Attestation } from './utils'
import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from '@ethereum-attestation-service/eas-sdk'
export const sellSchema: string = "uint256 collateral"

export type SellStruct = {
  /** the amount of collateral of the erc20 posted in the sell attestion, will get pulled from attestors wallet by the resolver, requires token approval */
  collateral: bigint
}

export type SellMessage = [
  collateral: {name: string, value: any, type: string},
]

export type SellParams  = {
  /**  the schemaUID for the sell attestation */
  schemaUID: `0x${string}`,
  /** the refUID for the onchain buy attestation */
  buyRefUID: `0x${string}`,
  /** the address of the seller, should be msg.sender */
  seller: `0x${string}`,
  /** the data for the sell attestation */
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

/**
 *  @description converts a sell attestion into the form consumed by the eas.attest() function
 */
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
