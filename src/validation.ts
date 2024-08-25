import { encodeMessage, Attestation } from './utils'


import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
} from 'eas-sdk'

export const validationSchema: string = "bool isApproved"

export type ValidationStruct = {
  /** whether the validator is approves the results of the job */
 isApproved: boolean 
}

export type ValidationMessage = [
  isApproved: {name: string, value: any, type: string}
]

export type ValidationParams = {
  /** the UID of the validation schema */
  schemaUID: `0x${string}`,
  /** the UID of the sell attestation, sell attestion references the buy, making a series of credible commitments */
  sellRefUID: `0x${string}`,
  /** the address of the validator */
  validator: `0x${string}`,
  /** the data used in the attestation */
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

/**
 *  @description converts a validation attestion into the form consumed by the eas.attest() function
 */
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
