import { encodeMessage, Attestation } from './utils'
import { WalletClient } from 'viem'
import {
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
  OffchainAttestationParams,
  OffchainAttestationOptions,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk'

import { TypeDataSigner } from '@ethereum-attestation-service/eas-sdk/dist/offchain/typed-data-handler';
import { getEAS, clientToSigner } from './utils'

export const buySchema: string  = "address supplier, uint256 jobCost, address paymentToken, uint256 creditsRequested, uint256 collateralRequested, uint256 offerDeadline, uint256 jobDeadline, uint256 arbitrationDeadline"  


export type BuyStruct = {
  supplier: `0x${string}`,
  jobCost: bigint,
  paymentToken: string,
  creditsRequested: bigint,
  collateralRequested: bigint,
  offerDeadline: bigint,
  jobDeadline: bigint,
  arbitrationDeadline: bigint
}

export type BuyMessage  = [
  supplier: {name: string, value: any, type: string},
  jobCost: {name: string, value: any, type: string},
  paymentToken: {name: string, value: any, type: string},
  creditsRequested: {name: string, value: any, type: string},
  collateralRequested: {name: string, value: any, type: string},
  offerDeadline: {name: string, value: any, type: string},
  jobDeadline: {name: string, value: any, type: string},
  arbitrationDeadline: {name: string, value: any, type: string}
]

export type BuyParams= {
  schemaUID: `0x${string}`,
  demander: `0x${string}`,
  data: BuyStruct
}


const createBuyMessage = ({
  supplier,
  jobCost,
  paymentToken,
  creditsRequested,
  collateralRequested,
  offerDeadline,
  jobDeadline,
  arbitrationDeadline
}: BuyStruct ) : BuyMessage => {
  return [
    {name: 'supplier', value: supplier, type: 'address'},
    {name: 'jobCost', value: jobCost, type: 'uint256'},
    {name: 'paymentToken', value: paymentToken, type: 'address'},
    {name: 'creditsRequested', value: creditsRequested, type: 'uint256'},
    {name: 'collateralRequested', value: collateralRequested, type: 'uint256'},
    {name: 'offerDeadline', value: offerDeadline, type: 'uint256'},
    {name: 'jobDeadline', value: jobDeadline, type: 'uint256'},
    {name: 'arbitrationDeadline', value: arbitrationDeadline, type: 'uint256'}
  ]
}

const createBuyData = ({
  supplier,
  jobCost,
  paymentToken,
  creditsRequested,
  collateralRequested,
  offerDeadline,
  jobDeadline,
  arbitrationDeadline
}: BuyStruct): `0x${string}` => {
  return encodeMessage(buySchema, createBuyMessage({
    supplier,
    jobCost,
    paymentToken,
    creditsRequested,
    collateralRequested,
    offerDeadline,
    jobDeadline,
    arbitrationDeadline
  }))
}


export const createBuyAttestation = (buyParams: BuyParams): Attestation => {
  return {
    schema: buyParams.schemaUID,
    data: {
      recipient: buyParams.demander,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      refUID: ZERO_BYTES32,
      data: createBuyData(buyParams.data),
      value: 0n
    }
  }
  
}


export const signOffchainBuyMessage = async (
  easAddress: `0x${string}`,
  walletClient: WalletClient,
  buyParams: BuyParams,
  options?: OffchainAttestationOptions
)  => {
  const signer = clientToSigner(walletClient)
  if (!signer) return
  const eas = getEAS(easAddress, signer)
  const offchain = await eas.getOffchain()

  return await offchain.signOffchainAttestation(
    {
      recipient: buyParams.demander,
      expirationTime: 0n,
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable: true,
      schema: buyParams.schemaUID,
      refUID: ZERO_BYTES32,
      data: createBuyData(buyParams.data),
    },
    signer as TypeDataSigner,
  )
}


export const verifyOffchainBuyMessage = async (
  easAddress: `0x${string}`,
  walletClient: WalletClient,
  attestor: `0x${string}`,
  attestation: SignedOffchainAttestation
) => {
  const signer = clientToSigner(walletClient)
  if (!signer) return
  const eas = getEAS(easAddress, signer)
  
  const offchain = await eas.getOffchain()
  return await offchain.verifyOffchainAttestationSignature(
    attestor,
    attestation
  )
}
