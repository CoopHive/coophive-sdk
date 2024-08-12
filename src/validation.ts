import { encodeMessage, Attestation } from './utils'


import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from '@ethereum-attestation-service/eas-sdk'
export const validationSchema: string = "bool isApproved"

export type ValidationStruct = {
 isApproved: boolean 
}

export type ValidationMessage = [
  isApproved: {name: string, value: any, type: string}
]

export type ValidationParams = {
  schemaUID: `0x${string}`,
  sellRefUID: `0x${string}`,
  validator: `0x${string}`,
  data: ValidationStruct
}

const createValidationMessage = ({isApproved}:{isApproved:Boolean}): ValidationMessage => {
  return [
    {name: 'isApproved', value: isApproved, type: 'bool'}
  ]
}

const createValidationData = ({isApproved}:{isApproved:Boolean}): `0x${string}` => {
  return encodeMessage(validationSchema, createValidationMessage({isApproved}))
}

export const createValidationAttestation = ({
  schemaUID,
  validator,
  isApproved,
  sellRefUID
}:{
  schemaUID: `0x${string}`
  validator: `0x${string}`
  isApproved: Boolean
  sellRefUID: `0x${string}`
}): Attestation => {
  return {
    schema: schemaUID,
    data: {
      recipient: validator,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      refUID: sellRefUID,
      data: createValidationData({isApproved}),
      value: 0n
    }
  }

}
