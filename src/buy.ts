import { PublicClient, WalletClient, parseAbiParameters, decodeAbiParameters } from 'viem'
import { baseSepolia } from 'viem/chains'
import { JsonRpcSigner } from 'ethers'
import {
  EAS,
  Transaction,
  AttestationRequest,
  AttestationRequestData,
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
  OffchainAttestationParams,
  OffchainAttestationOptions,
  SignedOffchainAttestation,
} from 'eas-sdk'

import { getEAS, clientToSigner, clientToProvider, encodeMessage, Attestation } from './utils'

export const buySchema: string  = "address supplier, uint256 jobCost, address paymentToken, string image, string prompt, uint256 collateralRequested, uint256 offerDeadline, uint256 jobDeadline, uint256 arbitrationDeadline"  
export const buyAbi = parseAbiParameters(buySchema)

export const parseBuyAbi = (data: any) => {
  data =  decodeAbiParameters(buyAbi, data)
  const [supplier, jobCost, paymentToken, image, prompt, collateralRequested, offerDeadline, jobDeadline, arbitrationDeadline] = data
  return {
    supplier,
    jobCost,
    paymentToken,
    image,
    prompt,
    collateralRequested,
    offerDeadline,
    jobDeadline,
    arbitrationDeadline
  }
} 


export type BuyStruct = {
  /** The public ethereum address of the desired counterparty */
  supplier: `0x${string}`,
  /** The cost of the job in wei, to be paid to the supplier upon successful mediation */
  jobCost: bigint,
  /** The erc20 token used to pay for the job */
  paymentToken: `0x${string}`,
  image: string,
  /** The number of credits requested, credits are stored offchain in a trusted manner and consumed in querymaking */
  prompt: string,
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
  image: {name: string, value: any, type: string},
  prompt: {name: string, value: any, type: string},
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
  image,
  prompt,
  collateralRequested,
  offerDeadline,
  jobDeadline,
  arbitrationDeadline
}: BuyStruct ) : BuyMessage => {
  return [
    {name: 'supplier', value: supplier, type: 'address'},
    {name: 'jobCost', value: jobCost, type: 'uint256'},
    {name: 'paymentToken', value: paymentToken, type: 'address'},
    {name: 'image', value: image, type: 'string'},
    {name: 'prompt', value: prompt, type: 'string'},
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
  image,
  prompt,
  collateralRequested,
  offerDeadline,
  jobDeadline,
  arbitrationDeadline
}: BuyStruct): `0x${string}` => {
  return encodeMessage(buySchema, createBuyMessage({
    supplier,
    jobCost,
    paymentToken,
    image,
    prompt,
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


export const ethersSignOffchainBuyMessage = async (
  easAddress: `0x${string}`,
  signer: JsonRpcSigner,
  buyParams: BuyParams,
  options?: OffchainAttestationOptions
)  => {
  const eas = getEAS(easAddress, signer)
  const offchain = await eas.getOffchain()
  const offchainAttestation =  await offchain.signOffchainAttestation(
    {
      recipient: buyParams.demander,
      expirationTime: 0n,
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable: true,
      schema: buyParams.schemaUID,
      refUID: ZERO_BYTES32,
      data: createBuyData(buyParams.data),
    },
    signer,
  )

  return offchainAttestation
}


/**
 * @description attests to an offchain buy attestation, used to negotiate between buyers and seller over exact parameters
 */
export const signOffchainBuyMessage = async (
  easAddress: `0x${string}`,
  privateKey: `0x${string}`,
  walletClient: WalletClient,
  buyParams: BuyParams,
  options?: OffchainAttestationOptions
): Promise<SignedOffchainAttestation|undefined> => {
  const signer = clientToSigner(walletClient)
  if (!signer) return
  //@ts-expect-error
  signer.privateKey = privateKey
  const eas = getEAS(easAddress, signer)
  const offchain = await eas.getOffchain()
  const offchainAttestation =  await offchain.signOffchainAttestation(
    {
      recipient: buyParams.demander,
      expirationTime: 0n,
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable: true,
      schema: buyParams.schemaUID,
      refUID: ZERO_BYTES32,
      data: createBuyData(buyParams.data),
    },
    signer,
  )

  return offchainAttestation
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

export const attestBuyMessage = async (
  easAddress: `0x${string}`,
  walletClient: WalletClient,
  buyParams: BuyParams
): Promise<Transaction<string> | Error > => {
  const signer = clientToSigner(walletClient)
  if (!signer) {return new Error("Wallet not connected")}
  const eas = getEAS(easAddress, signer)

  const requestData: AttestationRequestData = {
    recipient: buyParams.demander,
    data: createBuyData(buyParams.data),
  }
  const attestationRequest: AttestationRequest = {
    schema: buyParams.schemaUID,
    data: requestData
  }
  console.log(attestationRequest)
  const tx  = await eas.attest(attestationRequest)
  return tx
}
