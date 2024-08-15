import {
  BrowserProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,

} from "ethers";

import type { Account, Chain, Client, Transport, PublicClient, WalletClient  } from "viem";
import { BuyMessage } from './buy'
import { SellMessage } from './sell'
import { ValidationMessage } from './validation'
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'

export type Attestation = {
  /** the schema used in the attestation */
  schema: `0x${string}`,
  /** the data used in the attestation */
  data: {
    /** the recipient of the attestation, should be same as attestor */
    recipient: `0x${string}`,
    /** the expiration time of the attestation */
    expirationTime: bigint,
    /** whether the attestation is revocable, should be true */
    revocable: Boolean,
    /** the refUID of the attestation, chains the attestations together */
    refUID: `0x${string}`,
    /** the data used in the attestation */
    data: `0x${string}`,
    /** the value of the attestation, if supplied ether */
    value: bigint
  }
}
/**
 * @description encodes a message using the provided schema
 */
export const encodeMessage = (
  schema: string,
  message: BuyMessage | SellMessage | ValidationMessage
): `0x${string}` => {
  const encoder = new SchemaEncoder(schema)
  return encoder.encodeData(message) as `0x${string}`

}
/**
 * @description gets an EAS instance
 */
export const getEAS = (easContractAddress: `0x${string}`, signer: JsonRpcSigner) => {
  return new EAS(easContractAddress, {signer})
}

/**
 * @description converts a viem publicClient into an ethers provider to use the eas sdk
 */
export function clientToProvider(publicClient:PublicClient) {
  const { chain, transport  } = publicClient;
  if (!chain || !transport) return
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,

    };
    if (transport.type === "fallback") {
      const providers = (transport.transports as ReturnType<Transport>[]).map(
        ({ value  }) => new JsonRpcProvider(value?.url, network)

      );
      if (providers.length === 1) return providers[0];
      return new FallbackProvider(providers);

    }
    return new JsonRpcProvider(transport.url, network);

}
/**
 * @description converts a viem walletClient into an ethers signer to use the eas sdk
 */
export function clientToSigner(walletClient: WalletClient): JsonRpcSigner | undefined {
  const { account, chain, transport  } = walletClient;
  console.log('acount', account)
  console.log('chain', chain)
  console.log('transport', transport)

  if (!account || !chain || !transport) return 
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,

    };
    const provider = new BrowserProvider(transport, network);
    const signer = new JsonRpcSigner(provider, account.address);
    return signer;
}
