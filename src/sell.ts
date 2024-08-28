import { WalletClient, parseAbiParameters } from 'viem'
import { getEAS, encodeMessage, Attestation, clientToSigner } from './utils'
import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
  Transaction,
  AttestationRequest,
  AttestationRequestData
} from 'eas-sdk'

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


export const attestSellMessage = async (
  easAddress: `0x${string}`,
  walletClient: WalletClient,
  sellParams: SellParams
): Promise<Transaction<string> | Error > => {
  const signer = clientToSigner(walletClient)
  if (!signer) {return new Error("Wallet not connected")}
  const eas = getEAS(easAddress, signer)

  const requestData: AttestationRequestData = {
    recipient: sellParams.seller,
    data: createSellData(sellParams.data),
  }
  const attestationRequest: AttestationRequest = {
    schema: sellParams.schemaUID,
    data: requestData
  }
  const tx  = await eas.attest(attestationRequest)
  return tx
}
