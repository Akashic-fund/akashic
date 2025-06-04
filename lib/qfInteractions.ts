import {
  type Abi,
  encodeAbiParameters,
  parseAbiParameters,
  type Address,
  type Hash,
  type WriteContractParameters,
} from 'viem';
// {type ReadContractParameters, encodeFunctionData, getContractAddress } from 'viem'
// Import only necessary functions from @wagmi/core for reads if needed server-side,but primarily rely on client-side hooks for writes.
import { readContract, createConfig } from '@wagmi/core';
import { config } from '@/lib/web3/config/wagmi';
import { ALLO_ADDRESS, KICKSTARTER_QF_ADDRESS } from './constant';
// import { type Chain } from 'wagmi/chains' // Import Chain type
// import { deployContract } from 'wagmi/actions'

// --- Import ABIs ---
import { AlloABI } from '../contracts/abi/qf/Allo';
import { KickStarterQFABI } from '../contracts/abi/qf/KickStarterQF';
import { ERC20ABI } from '../contracts/abi/qf/ERC20';

const alloAbi = AlloABI as Abi;
const kickstarterQfAbi = KickStarterQFABI.abi as Abi;
const erc20Abi = ERC20ABI as Abi;

// const NATIVE_TOKEN_ADDRESS: Address = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

//Define the missing interfaces
interface RecipientInitializeData {
  metadataRequired: boolean;
  registrationStartTime: bigint;
  registrationEndTime: bigint;
}

interface Metadata {
  protocol: bigint;
  pointer: string;
}

interface Claim {
  recipientId: Address;
  token: Address;
}

//1. Create Pool - Prepare Args (Using createPoolWithCustomStrategy)
interface CreatePoolArgs {
  profileId: Hash; // bytes32
  // strategyAddress is now the *implementation* address to clone
  strategyImplementationAddress?: Address; // Defaults to KICKSTARTER_QF_ADDRESS
  initializationData: {
    recipientInitializeData: RecipientInitializeData;
    allocationStartTime: bigint; // uint64
    allocationEndTime: bigint; // uint64
    withdrawalCooldown: bigint; // uint64
    allowedTokens: Address[];
    isUsingAllocationMetadata: boolean; // Likely false based on KickstarterQF._allocate
  };
  token: Address; // Pool's native token (e.g., USDC address)
  amount: bigint; // Initial funding amount (requires prior ERC20 approval to ALLO_ADDRESS)
  metadata: Metadata;
  managers: Address[];
}

// This function now prepares the arguments for Allo's `createPool` function
export function prepareCreatePoolArgs({
  profileId,
  strategyImplementationAddress = KICKSTARTER_QF_ADDRESS, // Use implementation address
  initializationData,
  token,
  amount,
  metadata,
  managers,
}: CreatePoolArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log('Encoding strategy initialization data for createPool...');

  // Encode the strategy's initialization data structure
  // Ensure this matches EXACTLY what your KickstarterQF._initializeStrategy expects
  const encodedInitData = encodeAbiParameters(
    parseAbiParameters([
      // RecipientInitializeData struct definition
      '(bool metadataRequired, uint64 registrationStartTime, uint64 registrationEndTime)',
      'uint64', // allocationStartTime
      'uint64', // allocationEndTime
      'uint64', // withdrawalCooldown
      'address[]', // allowedTokens
      'bool', // isUsingAllocationMetadata
    ]),
    [
      initializationData.recipientInitializeData,
      initializationData.allocationStartTime,
      initializationData.allocationEndTime,
      initializationData.withdrawalCooldown,
      initializationData.allowedTokens,
      initializationData.isUsingAllocationMetadata,
    ],
  );

  console.log('Preparing createPool transaction arguments...');
  // Arguments for Allo's `createPool` function
  const args = [
    profileId, // _profileId (bytes32)
    strategyImplementationAddress, // _strategy (address of the implementation to clone)
    encodedInitData, // _initStrategyData (bytes)
    token, // _token (address)
    amount, // _amount (uint256)
    metadata, // _metadata (Metadata struct)
    managers, // _managers (address[])
  ];

  const requestArgs = {
    address: ALLO_ADDRESS, // Target Allo Proxy contract
    abi: alloAbi,
    functionName: 'createPoolWithCustomStrategy',
    args: args,
  };

  // Remove potentially problematic optional fields before returning
  // This helps avoid the transaction type mismatch error with useWriteContract
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  // Handle value correctly if present
  if ('value' in requestArgs && requestArgs.value !== undefined) {
    finalArgs.value = requestArgs.value as bigint;
  }

  return finalArgs;
}

//2: Register Recipient - Prepare Args
interface RegisterRecipientArgs {
  poolId: bigint;
  recipientAddresses?: Address[]; // Array of addresses to register (usually just one)
  recipientAddress: Address; // Primary address being registered
  recipientPayoutAddress: Address; // Address that will receive funds
  metadata: Metadata;
  proposalBid?: bigint; // Optional proposal bid amount
}

// Prepares arguments for Allo's `registerRecipient` function with proper encoding
export function prepareRegisterRecipientArgs({
  poolId,
  recipientAddresses,
  recipientAddress,
  recipientPayoutAddress,
  metadata,
  proposalBid,
}: RegisterRecipientArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log('--- Inside prepareRegisterRecipientArgs ---');
  console.log('Received Pool ID:', poolId?.toString());
  console.log('Received Recipient Addresses Array:', recipientAddresses);
  console.log('Received Recipient Address:', recipientAddress);
  console.log('Received Payout Address:', recipientPayoutAddress);
  console.log('Received Metadata:', metadata);
  console.log('Received Proposal Bid:', proposalBid?.toString());

  // Use provided addresses array or default to single address
  const addresses = recipientAddresses?.length
    ? recipientAddresses
    : [recipientAddress];

  console.log('Using Addresses Array:', addresses);

  // Step 1: Encode the recipient-specific data (inner encoding)
  const encodedProposalBid =
    proposalBid !== undefined && proposalBid !== null
      ? encodeAbiParameters(parseAbiParameters(['uint256']), [proposalBid])
      : '0x'; // Default to empty bytes if no bid

  console.log('Encoded Proposal Bid:', encodedProposalBid);

  const singleRecipientData = encodeAbiParameters(
    parseAbiParameters([
      'address',
      '(uint256 protocol, string pointer)',
      'bytes',
    ]),
    [recipientPayoutAddress, metadata, encodedProposalBid],
  );
  console.log('Step 1 Result (singleRecipientData):', singleRecipientData);

  // Step 2: Create an array of encoded recipient data (even if just one)
  const recipientDataArray = [singleRecipientData];
  console.log('Step 2 Result (recipientDataArray):', recipientDataArray);

  // Step 3: Encode the entire array as bytes[] (outer encoding)
  const encodedData = encodeAbiParameters(parseAbiParameters(['bytes[]']), [
    recipientDataArray,
  ]);
  console.log('Step 3 Result (final encodedData for contract):', encodedData);

  // Prepare the contract call arguments
  const requestArgs = {
    address: ALLO_ADDRESS,
    abi: alloAbi,
    functionName: 'registerRecipient',
    args: [
      poolId,
      addresses, // Array of addresses to register
      encodedData, // The properly nested encoded data
    ],
  };
  console.log(
    'Final Request Args:',
    requestArgs.address,
    requestArgs.functionName,
    requestArgs.args,
  );

  // Return a clean object with proper typing
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(
    `Args prepared for registering recipient(s): ${addresses.join(', ')}`,
  );
  console.log('--- Exiting prepareRegisterRecipientArgs ---');
  return finalArgs;
}

//3: Review Recipients - Prepare Args
// Define ApplicationStatus enum matching Solidity contract
export enum ApplicationStatus {
  None = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Appealed = 4,
}

interface ReviewRecipientsArgs {
  strategyAddress: Address; // Address of the specific KickstarterQF instance for the pool
  recipientIds: Address[];
  newStatuses: ApplicationStatus[]; // Use the enum
  recipientsCounter: bigint; // Read from strategy.recipientsCounter() before calling
}

// Prepares arguments for KickstarterQF's `reviewRecipients` function
export function prepareReviewRecipientsArgs({
  strategyAddress,
  recipientIds,
  newStatuses,
  recipientsCounter,
}: ReviewRecipientsArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  if (recipientIds.length !== newStatuses.length) {
    throw new Error(
      'Recipient IDs and statuses arrays must have the same length.',
    );
  }
  if (recipientIds.length === 0) {
    throw new Error('No recipients provided for review.');
  }

  console.log('Preparing reviewRecipients transaction arguments...');

  // Format the data as expected by the contract
  const applicationStatusStruct = {
    recipientIds: recipientIds,
    statuses: newStatuses.map((status) => BigInt(status)), // Convert enum values to bigint
  };

  const requestArgs = {
    address: strategyAddress,
    abi: kickstarterQfAbi,
    functionName: 'reviewRecipients',
    // The function expects an array of ApplicationStatus structs
    args: [[applicationStatusStruct], recipientsCounter],
  };

  // Return a clean object with proper typing
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(
    `Args prepared for reviewing ${recipientIds.length} recipients...`,
  );
  return finalArgs;
}

// Utility: Check ERC20 Allowance (Read Operation - Fix chainId type)
interface CheckAllowanceArgs {
  tokenAddress: Address;
  ownerAddress: Address;
  spenderAddress: Address;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chainId?: number; // Kept for backward compatibility but not used in readContract
}

export async function checkErc20Allowance({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chainId,
}: CheckAllowanceArgs): Promise<bigint> {
  console.log(
    `Checking ERC20 allowance for token ${tokenAddress}, owner ${ownerAddress}, spender ${spenderAddress}...`,
  );
  try {
    // chainId is not needed in readContract as wagmi handles chain management
    const allowance = (await readContract(createConfig(config), {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [ownerAddress, spenderAddress],
    })) as unknown as bigint;
    console.log(`Current allowance: ${allowance}`);
    return allowance;
  } catch (error) {
    console.error('Failed to read allowance:', error);
    throw new Error(
      `Could not check allowance: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Utility: Read DIRECT_TRANSFER flag (Read Operation - Fix chainId type)
interface ReadDirectTransferArgs {
  strategyAddress: Address;
  chainId?: number; // Kept for backward compatibility but not used in readContract
}

export async function checkDirectTransferFlag({
  strategyAddress,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chainId,
}: ReadDirectTransferArgs): Promise<boolean> {
  console.log(
    `Checking DIRECT_TRANSFER flag for strategy ${strategyAddress}...`,
  );
  try {
    // chainId is not needed in readContract as wagmi handles chain management
    const isDirectTransfer = (await readContract(createConfig(config), {
      address: strategyAddress,
      abi: kickstarterQfAbi,
      functionName: 'directTransfers',
    })) as unknown as boolean;
    console.log(`DIRECT_TRANSFER flag: ${isDirectTransfer}`);
    return isDirectTransfer;
  } catch (error) {
    console.error('Failed to read DIRECT_TRANSFER flag:', error);
    throw new Error(
      `Could not read DIRECT_TRANSFER flag: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// ApproveErc20Args interface needed for the function below
interface ApproveErc20Args {
  tokenAddress: Address;
  spenderAddress: Address;
  amount: bigint;
}

export function prepareApproveErc20Args({
  tokenAddress,
  spenderAddress,
  amount,
}: ApproveErc20Args): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing ERC20 approve transaction arguments for token ${tokenAddress}...`,
  );
  const requestArgs = {
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'approve',
    args: [spenderAddress, amount],
  };

  // Return a clean object with proper typing
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(
    `Args prepared for approving spender ${spenderAddress} for amount ${amount}...`,
  );
  return finalArgs;
}

// ==================================
// Phase 4: Allocate Funds (Single Allocation) - Prepare Args
// ==================================

// Use this for allocating Native currency (e.g., ETH, MATIC)
interface AllocateNativeArgs {
  poolId: bigint;
  recipientId: Address;
  amount: bigint; // Amount in native currency (wei)
}

// Prepares arguments for Allo's `allocate` function (Native)
export function prepareAllocateNativeArgs({
  poolId,
  recipientId,
  amount,
}: AllocateNativeArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing native allocate transaction arguments for pool ${poolId}, recipient ${recipientId}...`,
  );

  // Encode the recipient data (empty bytes for native allocation)
  const encodedRecipientData = '0x';

  const requestArgs = {
    address: ALLO_ADDRESS,
    abi: alloAbi,
    functionName: 'allocate',
    args: [poolId, encodedRecipientData],
    value: amount, // Native amount is sent as msg.value
  };

  // Return a clean object
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
    value: requestArgs.value,
  };

  console.log(`Args prepared for native allocation of ${amount} wei...`);
  return finalArgs;
}

// Use this for allocating ERC20 tokens
interface AllocateErc20Args {
  poolId: bigint;
  recipientId: Address;
  amount: bigint; // Amount in token's smallest unit
  tokenAddress: Address; // Address of the ERC20 token being allocated
}

// Prepares arguments for Allo's `allocate` function (ERC20)
export function prepareAllocateErc20Args({
  poolId,
  recipientId,
  amount,
  tokenAddress,
}: AllocateErc20Args): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing ERC20 allocate transaction arguments for pool ${poolId}, recipient ${recipientId}, token ${tokenAddress}...`,
  );

  // Encode the recipient data for ERC20 allocation
  const encodedRecipientData = encodeAbiParameters(
    parseAbiParameters([
      'address recipientId',
      'uint256 amount',
      'address tokenAddress',
    ]),
    [recipientId, amount, tokenAddress],
  );

  const requestArgs = {
    address: ALLO_ADDRESS,
    abi: alloAbi,
    functionName: 'allocate',
    args: [poolId, encodedRecipientData],
    // No value for ERC20 allocation
  };

  // Return a clean object
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(`Args prepared for ERC20 allocation of ${amount} tokens...`);
  return finalArgs;
}

// ==================================
// Phase 5: Distribute Funds - Prepare Args
// ==================================

interface DistributeArgs {
  poolId: bigint;
  recipientIds: Address[];
  data: Hash; // bytes - Typically '0x' unless the strategy requires specific data
}

// Prepares arguments for Allo's `distribute` function
export function prepareDistributeArgs({
  poolId,
  recipientIds,
  data = '0x',
}: DistributeArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing distribute transaction arguments for pool ${poolId}...`,
  );

  const requestArgs = {
    address: ALLO_ADDRESS,
    abi: alloAbi,
    functionName: 'distribute',
    args: [poolId, recipientIds, data],
  };

  // Return a clean object
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address as `0x${string}`,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(
    `Args prepared for distributing funds to ${recipientIds.length} recipients...`,
  );
  return finalArgs;
}

// ==================================
// Phase 6: Withdraw Funds (KickstarterQF Specific) - Prepare Args
// ==================================

interface WithdrawArgs {
  strategyAddress: Address; // Address of the *specific* KickstarterQF instance for the pool
  recipientId: Address;
  tokenAddress: Address; // Token to withdraw
}

// Prepares arguments for KickstarterQF's `withdraw` function
export function prepareWithdrawArgs({
  strategyAddress,
  recipientId,
  tokenAddress,
}: WithdrawArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing withdraw transaction arguments for strategy ${strategyAddress}, recipient ${recipientId}, token ${tokenAddress}...`,
  );

  const requestArgs = {
    address: strategyAddress,
    abi: kickstarterQfAbi,
    functionName: 'withdraw',
    args: [recipientId, tokenAddress],
  };

  // Return a clean object
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(`Args prepared for withdrawing token ${tokenAddress}...`);
  return finalArgs;
}

// ==================================
// Phase 7: Claim Allocations (KickstarterQF Specific) - Prepare Args
// ==================================

interface ClaimAllocationArgs {
  strategyAddress: Address; // Address of the *specific* KickstarterQF instance for the pool
  claims: Claim[]; // Array of { recipientId, token } structs
}

// Note: The check for DIRECT_TRANSFER still needs to happen client-side before calling this
// Prepares arguments for KickstarterQF's `claimAllocations` function
export function prepareClaimAllocationsArgs({
  strategyAddress,
  claims,
}: ClaimAllocationArgs): Omit<WriteContractParameters, 'account' | 'chain'> {
  console.log(
    `Preparing claimAllocations transaction arguments for strategy ${strategyAddress}...`,
  );

  const requestArgs = {
    address: strategyAddress,
    abi: kickstarterQfAbi,
    functionName: 'claimAllocations',
    args: [claims],
  };

  // Return a clean object
  const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
    address: requestArgs.address,
    abi: requestArgs.abi,
    functionName: requestArgs.functionName,
    args: requestArgs.args,
  };

  console.log(`Args prepared for claiming ${claims.length} allocations...`);
  return finalArgs;
}

// ==================================
// Utility: ERC20 Approve - Prepare Args
// ==================================

// interface ApproveErc20Args {
//     tokenAddress: Address
//     spenderAddress: Address // e.g., ALLO_ADDRESS for allocateErc20, or strategyAddress if needed elsewhere
//     amount: bigint
// }

// export function prepareApproveErc20Args({ tokenAddress, spenderAddress, amount }: ApproveErc20Args): Omit<WriteContractParameters, 'account' | 'chain'> {
//     console.log(`Preparing ERC20 approve transaction arguments for token ${tokenAddress}...`)
//     const requestArgs = {
//         address: tokenAddress,
//         abi: erc20Abi,
//         functionName: 'approve',
//         args: [spenderAddress, amount],
//     } // satisfies Omit<WriteContractParameters, 'account' | 'chain'>

//     // Return a clean object
//     const finalArgs: Omit<WriteContractParameters, 'account' | 'chain'> = {
//         address: requestArgs.address,
//         abi: requestArgs.abi,
//         functionName: requestArgs.functionName,
//         args: requestArgs.args,
//     };

//     console.log(`Args prepared for approving spender ${spenderAddress} for amount ${amount}...`)
//     return finalArgs;
// }

// ========================================
// Strategy Deployment - Prior to Pool Creation
// ========================================

interface DeployKickstarterQFArgs {
  allo: Address; // Allo contract address
  name: string; // Strategy name (best to make unique)
  directTransfers: boolean; // Whether direct transfers are enabled
}

/**
 * Prepares arguments for deploying a new KickstarterQF contract
 * Note: This function returns the transaction parameters, not a promise
 * The actual deployment should be done with wagmi's deployContract hook
 */
export function prepareDeployKickstarterQFArgs({
  allo = ALLO_ADDRESS,
  name,
  directTransfers = false,
}: DeployKickstarterQFArgs): {
  abi: Abi;
  bytecode: `0x${string}`;
  args: [Address, string, boolean];
} {
  const uniqueName = name || `KickstarterQF-${Date.now()}`;

  console.log(
    `Preparing to deploy KickstarterQF contract with name: ${uniqueName}`,
  );

  // Ensure we get the correct bytecode format and type
  const bytecode =
    (KickStarterQFABI.bytecode?.object as `0x${string}`) ||
    (KickStarterQFABI.bytecode as unknown as `0x${string}`);

  return {
    abi: KickStarterQFABI.abi as Abi,
    bytecode,
    args: [allo, uniqueName, directTransfers],
  };
}
