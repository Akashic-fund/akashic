import { Wallet } from 'ethers';
export interface NidParams {
    proofHash: string;
    signature: string;
    publicKey: string;
}

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string | number;
    }[];
}

export interface IntegrityProof {
    proof_hash: string;
    asset_mime_type: string;
    created_at: number;
}

export interface SignatureData {
    proofHash: string;
    provider: string;
    signature: string;
    publicKey: string;
    integritySha: string;
}

export interface NFTCreateParams { 
    nid: string;
    network: string;
    contractAddress: string;
    metadata: NFTMetadata;
    options: {
        gasLimit: number;
        gasPrice: string;
    };
}

export interface NFTCreateResult {
    network: string;
    contractAddress: string;
    tokenId: number;
    metadata: NFTMetadata;
    transactionHash: string;
}

declare module '@numbersprotocol/nit' {
    export function getIntegrityHash(data: Buffer): Promise<string>;
    export function signIntegrityHash(hash: string, signer: Wallet): Promise<string>;
    export function verifyIntegrityHash(hash: string, signature: string): Promise<string>;
    export function generateNid(params: NidParams): Promise<string>;
    
    export namespace nft {
        export function create(params: NFTCreateParams): Promise<NFTCreateResult>;
    }
} 