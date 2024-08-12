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
export const encodeMessage = (
  schema: string,
  message: BuyMessage | SellMessage | ValidationMessage
): `0x${string}` => {
  const encoder = new SchemaEncoder(schema)
  return encoder.encodeData(message) as `0x${string}`

}

export const getEAS = (easContractAddress: `0x${string}`, signer: JsonRpcSigner) => {
  return new EAS(easContractAddress, {signer})
}

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
