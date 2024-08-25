/*

import type { OffchainAttestationParams, OffchainAttestationOptions, SignedOffchainAttestation } from 'eas-sdk';
import { hexlify } from '@ethersproject/bytes';

import { getEAS, clientToSigner } from './utils';

const SALT_SIZE = 32;
const DEFAULT_OFFCHAIN_ATTESTATION_OPTIONS = {
  verifyOnchain: true
};
import type {TypeDataSigner} from 'eas-sdk/dist/offchain/typed-data-handler'



export const signOffchainAttestation = async (
    params: OffchainAttestationParams,
    signer: TypeDataSigner,
    options?: OffchainAttestationOptions
  ): Promise<SignedOffchainAttestation> =>{
    const typedData = { version: this.version, ...params };

    // If no salt was provided - generate a random salt.
    if (this.version >= OffchainAttestationVersion.Version2 && !typedData.salt) {
      typedData.salt = hexlify(randomBytes(SALT_SIZE));
    }

    const signedRequest = await this.signTypedDataRequest<EIP712MessageTypes, OffchainAttestationTypedData>(
      typedData,
      {
        domain: this.getDomainTypedData(),
        primaryType: this.signingType.primaryType,
        message: typedData,
        types: this.signingType.types
      },
      signer
    );

    const { verifyOnchain } = { ...DEFAULT_OFFCHAIN_ATTESTATION_OPTIONS, ...options };
    if (verifyOnchain) {
      try {
        const { schema, recipient, expirationTime, revocable, data } = params;

        // Verify the offchain attestation onchain by simulating a contract call to attest. Since onchain verification
        // makes sure that any referenced attestations exist, we will set refUID to ZERO_BYTES32.
        await this.eas.contract.attest.staticCall(
          {
            schema,
            data: { recipient, expirationTime, revocable, refUID: params.refUID || ZERO_BYTES32, data, value: 0 }
          },
          { from: signer }
        );
      } catch (e: unknown) {
        throw new Error(`Unable to verify offchain attestation with: ${e}`);
      }
    }

    return {
      version: this.version,
      uid: this.getOffchainUID(typedData),
      ...signedRequest
    };
  }

 */
