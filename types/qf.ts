import { BigNumber } from 'ethers';

/**
 * Metadata structure as defined in Allo contracts
 * @property protocol - The protocol identifier (e.g., 1 for IPFS)
 * @property pointer - The pointer to the metadata (e.g., IPFS hash)
 */
export interface Metadata {
  protocol: number;
  pointer: string;
}

/**
 * Recipient registration options
 * @property useProfileAnchor - Whether to use a profile anchor for registration
 * @property profileAnchor - The profile anchor address (only used if useProfileAnchor is true)
 * @property recipientAddress - The address that will receive funds
 * @property metadata - Metadata information for the recipient
 * @property proposalBid - Proposed bid amount as a number or BigNumber
 */
export interface RecipientRegistrationParams {
  useProfileAnchor: boolean;
  profileAnchor?: string; // Optional: only needed if useProfileAnchor is true
  recipientAddress: string;
  metadata: Metadata;
  proposalBid: number | BigNumber;
}

/**
 * Response from registerRecipient function
 * @property success - Whether the registration was successful
 * @property recipientIds - Array of registered recipient IDs
 * @property txHash - Transaction hash
 * @property error - Error message if registration failed
 */
export interface RegistrationResponse {
  success: boolean;
  recipientIds?: string[];
  txHash?: string;
  error?: string;
}

/**
 * Contract addresses and IDs configuration
 */
export interface ContractConfig {
  alloAddress: string;
  poolId: number | BigNumber;
}
