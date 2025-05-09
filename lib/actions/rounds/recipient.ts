import { BigNumber, utils } from 'ethers';

export interface Metadata {
  protocol: number;
  pointer: string;
}

export interface RecipientRegistrationParams {
  poolId: number;
  recipientAddresses: string[];
  useProfileAnchor: boolean;
  profileAnchor?: string;
  metadata: Metadata;
  proposalBid: BigNumber | string | number;
}

/**
 * Validates an Ethereum address
 * @param address - Address to validate
 * @returns Validated and checksummed address
 * @throws Error if address is invalid
 */
export function validateAddress(address: string): string {
  try {
    if (!address || address === '') {
      throw new Error('Address cannot be empty');
    }
    // Convert to checksum address and validate format
    return utils.getAddress(address);
  } catch (error) {
    console.error('Error validating address:', error);
    throw new Error(`Invalid Ethereum address: ${address}`);
  }
}

/**
 * Validates a BigNumber is positive and within safe uint256 range
 * @param value - Value to validate
 * @param label - Label for error messages
 * @returns Validated BigNumber
 * @throws Error if value is invalid
 */
export function validateBigNumber(
  value: BigNumber | string | number,
  label: string,
): BigNumber {
  try {
    const bigNumberValue = BigNumber.from(value);
    if (bigNumberValue.isNegative()) {
      throw new Error(`${label} cannot be negative`);
    }

    // Check if within uint256 range
    const maxUint256 = BigNumber.from(2).pow(256).sub(1);
    if (bigNumberValue.gt(maxUint256)) {
      throw new Error(`${label} exceeds maximum uint256 value`);
    }

    return bigNumberValue;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Invalid ${label}: ${value}`);
  }
}

/**
 * Validates metadata for completeness and format
 * @param metadata - Metadata to validate
 * @returns Validated metadata
 * @throws Error if metadata is invalid
 */
export function validateMetadata(metadata: Metadata): Metadata {
  if (!metadata) {
    throw new Error('Metadata is required');
  }

  if (metadata.protocol === undefined || metadata.protocol === null) {
    throw new Error('Metadata protocol is required');
  }

  if (!metadata.pointer) {
    throw new Error('Metadata pointer is required');
  }

  // Validate protocol is a valid number
  const protocol = Number(metadata.protocol);
  if (isNaN(protocol) || protocol < 0) {
    throw new Error('Invalid metadata protocol value');
  }

  // Limit metadata pointer length to prevent gas issues
  if (metadata.pointer.length > 1000) {
    throw new Error('Metadata pointer exceeds maximum length (1000 chars)');
  }

  return {
    protocol: protocol,
    pointer: metadata.pointer,
  };
}

/**
 * Encodes recipient data for a single recipient
 * @param anchorOrZero - Profile anchor address or zero address if sender should be the ID
 * @param metadata - Metadata information for the recipient
 * @param extraData - Additional data (encoded as bytes)
 * @returns Encoded recipient data as a bytes string
 * @throws Error if encoding fails
 */
export function encodeRecipientData(
  anchorOrZero: string,
  metadata: Metadata,
  extraData: string,
): string {
  try {
    // Validate inputs - anchor address for contract manager 0x03609C49831F3D2a9036A85B39309212BEd104ba
    const validatedAnchor = validateAddress(anchorOrZero);
    const validatedMetadata = validateMetadata(metadata);

    return utils.defaultAbiCoder.encode(
      ['address', 'tuple(uint256 protocol, string pointer)', 'bytes'],
      [
        validatedAnchor,
        [validatedMetadata.protocol, validatedMetadata.pointer],
        extraData,
      ],
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to encode recipient data: ${error.message}`);
    }
    throw new Error('Failed to encode recipient data: Unknown error');
  }
}

/**
 * Encodes proposal bid data
 * @param proposalBid - The bid amount
 * @returns Encoded bid data as a bytes string
 * @throws Error if encoding fails
 */
export function encodeProposalBid(
  proposalBid: BigNumber | string | number,
): string {
  try {
    const validatedBid = validateBigNumber(proposalBid, 'Proposal bid');

    return utils.defaultAbiCoder.encode(['uint256'], [validatedBid]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to encode proposal bid: ${error.message}`);
    }
    throw new Error('Failed to encode proposal bid: Unknown error');
  }
}

/**
 * Encodes outer data for allo.registerRecipient
 * @param innerDataArray - Array of inner data blobs
 * @returns Encoded outer data as a bytes string
 * @throws Error if encoding fails
 */
export function encodeOuterData(innerDataArray: string[]): string {
  try {
    if (!innerDataArray || innerDataArray.length === 0) {
      throw new Error('Inner data array cannot be empty');
    }

    return utils.defaultAbiCoder.encode(['bytes[]'], [innerDataArray]);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to encode outer data: ${error.message}`);
    }
    throw new Error('Failed to encode outer data: Unknown error');
  }
}

/**
 * Prepares all data required for registering recipient(s)
 * @param params - Registration parameters
 * @returns Object containing recipientAddresses array, encoded outerData, and gas estimate info
 * @throws Error if preparation fails
 */
export function prepareRegistrationData(params: RecipientRegistrationParams) {
  try {
    // Validate required parameters
    if (!params) {
      throw new Error('Registration parameters are required');
    }

    if (!params.recipientAddresses || params.recipientAddresses.length === 0) {
      throw new Error('At least one recipient address is required');
    }

    if (!params.metadata) {
      throw new Error('Metadata is required');
    }

    // Validate each recipient address
    const validatedRecipientAddresses = params.recipientAddresses.map(
      (address) => validateAddress(address),
    );

    // Validate and encode the proposal bid
    const extraData = encodeProposalBid(params.proposalBid);

    // Determine and validate the anchor address ( for main round creator address) 0x03609C49831F3D2a9036A85B39309212BEd104ba
    // let anchorAddress = ethers.constants.AddressZero;
    let anchorAddress = '0x03609C49831F3D2a9036A85B39309212BEd104ba';
    if (params.useProfileAnchor) {
      if (!params.profileAnchor) {
        throw new Error(
          'Profile anchor is required when useProfileAnchor is true',
        );
      }
      anchorAddress = validateAddress(params.profileAnchor);
      // Note: Even if using profile anchor, some strategies might still expect
      // the payout address in the innerData encoding. We prioritize payout address here.
    }

    // Process each recipient
    const innerDataArray: string[] = [];
    for (const recipientAddress of validatedRecipientAddresses) {
      console.log('recipientAddress:', recipientAddress);
      const innerData = encodeRecipientData(
        anchorAddress,
        params.metadata,
        extraData,
      );
      innerDataArray.push(innerData);
    }

    console.log('innerDataArray:', innerDataArray);
    console.log('validatedRecipientAddresses:', validatedRecipientAddresses);
    console.log('params.metadata:', params.metadata);
    console.log('extraData:', extraData);
    console.log('anchorAddress:', anchorAddress);

    // Encode the outer data array
    const outerData = encodeOuterData(innerDataArray);

    // Include gas estimation guidance
    const gasEstimateInfo = {
      baseGas: 21000,
      perRecipientGas: 100000, // Approximate value, should be adjusted based on contract complexity
      totalEstimatedGas: 21000 + validatedRecipientAddresses.length * 100000,
      note: 'This is an estimate only. Actual gas costs may vary.',
    };

    return {
      poolId: params.poolId,
      recipientAddresses: validatedRecipientAddresses,
      outerData,
      gasEstimateInfo,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to prepare registration data: ${error.message}`);
    }
    throw new Error('Failed to prepare registration data: Unknown error');
  }
}

/**
 * Estimates the required value to send with the transaction if needed
 * @param params - Registration parameters
 * @param minimumBid - Minimum bid required by the pool (if any)
 * @returns The estimated value to send with transaction
 */
export function estimateTransactionValue(
  params: RecipientRegistrationParams,
  minimumBid?: BigNumber | string | number,
): BigNumber {
  try {
    const proposalBid = validateBigNumber(params.proposalBid, 'Proposal bid');

    if (minimumBid) {
      const minimumBidBN = validateBigNumber(minimumBid, 'Minimum bid');
      if (proposalBid.lt(minimumBidBN)) {
        throw new Error(
          `Proposal bid (${proposalBid.toString()}) is less than minimum required (${minimumBidBN.toString()})`,
        );
      }
    }

    return proposalBid;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to estimate transaction value: ${error.message}`);
    }
    throw new Error('Failed to estimate transaction value: Unknown error');
  }
}

/**
 * Helper function to build the complete transaction params for contract call
 * @param params - Registration parameters
 * @param minimumBid - Minimum bid required by the pool (if any)
 * @returns Complete transaction parameters for contract call
 */
export function buildTransactionParams(
  params: RecipientRegistrationParams,
  minimumBid?: BigNumber | string | number,
) {
  const preparedData = prepareRegistrationData(params);
  const value = estimateTransactionValue(params, minimumBid);

  return {
    poolId: preparedData.poolId,
    recipientAddresses: preparedData.recipientAddresses,
    data: preparedData.outerData,
    value,
    gasEstimate: preparedData.gasEstimateInfo,
  };
}
