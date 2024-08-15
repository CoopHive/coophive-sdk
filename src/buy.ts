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
  /** The public ethereum address of the desired counterparty */
  supplier: `0x${string}`,
  /** The cost of the job in wei, to be paid to the supplier upon successful mediation */
  jobCost: bigint,
  /** The erc20 token used to pay for the job */
  paymentToken: string,
  /** The number of credits requested, credits are stored offchain in a trusted manner and consumed in querymaking */
  creditsRequested: bigint,
  /** The amount of collateral the buyer desires the supplier posts to incentivize correct completion of the job */ 
  collateralRequested: bigint,
  /** The deadline this offer is active, agreements on this attestation cannot be made after this deadline */
  offerDeadline: bigint,
  /** The deadline the job is active, the final time the job must be completed and results posted to not be slashed */
  jobDeadline: bigint,
  /** The deadline for the arbiter to confirm the sanctity of the transaction, the arbiter will be slashed if the deadline is exceeded */
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
  /** The UID of the schema, used to point to the valid EAS resolver-schema pairing */
  schemaUID: `0x${string}`,
  /** The public ethereum address of who this attestation belongs to */
  demander: `0x${string}`,
  /** The data of the attestation */
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

/**
 * @description converts an attestion into the form consumed by the eas.attest() function
 */
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

/**
 * @description attests to an offchain buy attestation, used to negotiate between buyers and seller over exact parameters
 */
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

/**
 * @description verifies an offchain buy from a counterparty, used to determine authenticity of offers negotiated
 */
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
