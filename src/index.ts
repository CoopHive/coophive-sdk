import {
  SchemaEncoder,
  NO_EXPIRATION,
  ZERO_ADDRESS,
  ZERO_BYTES32,
  getUID
} from '@ethereum-attestation-service/eas-sdk';

export type Attestation = {
  schema: `0x${string}`,
  data: {
    recipient: `0x${string}`,
    expirationTime: bigint,
    revocable: Boolean,
    refUID: `0x${string}`,
    data: `0x${string}`,
    value: bigint
  }
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

export type SellMessage = [
  collateral: {name: string, value: any, type: string},
]

export type ValidationMessage = [
  isApproved: {name: string, value: any, type: string}
]

export const buySchema: string  = "address supplier, uint256 jobCost, address paymentToken, uint256 creditsRequested, uint256 collateralRequested, uint256 offerDeadline, uint256 jobDeadline, uint256 arbitrationDeadline"  
//export const  buySchemaUID: `0x${string}` = '0x5ab6e882c945d6d756ed93fff7ec7419fec64845cc0a480bfea2af053d685ee7'

export const sellSchema: string = "uint256 collateral"
//export const  sellSchemaUID: `0x${string}` = '0x06d7582e367e1ba8ceafd2e75d7c3f35c10ad488bdc79f18433ed4b18705b662'

export const validationSchema: string = "bool isApproved"
//export const validationSchemaUID: `0x${string}` = '0x9581c888ba04af2923f453471f58f2dc70a23ee765142714853a623c88d866cf' 
const encodeMessage = (
  schema: string,
  message: BuyMessage | SellMessage | ValidationMessage
): `0x${string}` => {
  const encoder = new SchemaEncoder(schema)
  return encoder.encodeData(message) as `0x${string}`

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
}:{
  supplier: `0x${string}`
  jobCost: bigint
  paymentToken: string
  creditsRequested: bigint
  collateralRequested: bigint
  offerDeadline: bigint
  jobDeadline: bigint
  arbitrationDeadline: bigint
}) : BuyMessage => {
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
}: {
  supplier: `0x${string}`
  jobCost: bigint
  paymentToken: string
  creditsRequested: bigint
  collateralRequested: bigint
  offerDeadline: bigint
  jobDeadline: bigint
  arbitrationDeadline: bigint
}): `0x${string}` => {
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


export const createBuyAttestation = ({
  schemaUID,
  demander,
  supplier,
  jobCost,
  paymentToken,
  creditsRequested,
  collateralRequested,
  offerDeadline,
  jobDeadline,
  arbitrationDeadline
}:{
  schemaUID: `0x${string}`
  demander: `0x${string}`
  supplier: `0x${string}`
  jobCost: bigint
  paymentToken: `0x${string}`
  creditsRequested: bigint
  collateralRequested: bigint
  offerDeadline: bigint
  jobDeadline: bigint
  arbitrationDeadline: bigint
}): Attestation => {
  return {
    schema: schemaUID,
    data: {
      recipient: demander,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      refUID: ZERO_BYTES32,
      data: createBuyData({
        supplier,
        jobCost,
        paymentToken,
        creditsRequested,
        collateralRequested,
        offerDeadline,
        jobDeadline,
        arbitrationDeadline
      }),
      value: 0n
    }
  }
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

