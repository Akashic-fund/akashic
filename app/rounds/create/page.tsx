'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useDeployContract,
} from 'wagmi';
import {
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
  maxUint256,
  decodeEventLog,
  BaseError,
} from 'viem';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  prepareApproveErc20Args,
  prepareCreatePoolArgs,
  checkErc20Allowance,
} from '@/lib/qfInteractions';
import { ALLO_ADDRESS } from '@/lib/constant';
import { AlloABI } from '@/contracts/abi/qf/Allo';
import { saveRoundAction } from '@/lib/actions/rounds/createRound';
import { KickStarterQFABI } from '@/contracts/abi/qf/KickStarterQF';
import { useChain } from '@/lib/web3/hooks/use-web3';

// Define the schema
const roundSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z
    .string()
    .min(30, { message: 'Description must be at least 30 characters.' }),
  matchingPool: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Matching pool must be a non-negative number.',
    }),
  tokenAddress: z
    .string()
    .refine((val): val is Address => /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid token address format. Use 0x...',
    }),
  tokenDecimals: z.coerce
    .number()
    .int()
    .min(0)
    .max(18, 'Decimals must be between 0 and 18.')
    .default(6),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  applicationStart: z.string().min(1, 'Application start date is required.'),
  applicationClose: z.string().min(1, 'Application close date is required.'),
  logoUrl: z
    .string()
    .url({ message: 'Logo URL must be a valid URL.' })
    .optional()
    .or(z.literal('')),
  profileId: z
    .string()
    .refine((val): val is Hash => /^0x[a-fA-F0-9]{64}$/.test(val), {
      message: 'Invalid Profile ID format. Use 0x... (64 hex chars).',
    }),
});

// Same date validation refinements
const refinedRoundSchema = roundSchema
  .refine(
    (data) => {
      try {
        return (
          new Date(data.applicationClose) > new Date(data.applicationStart)
        );
      } catch {
        return false;
      }
    },
    {
      message: 'Application close date must be after application start date.',
      path: ['applicationClose'],
    },
  )
  .refine(
    (data) => {
      try {
        return new Date(data.endDate) > new Date(data.startDate);
      } catch {
        return false;
      }
    },
    {
      message: 'Round end date must be after round start date.',
      path: ['endDate'],
    },
  )
  .refine(
    (data) => {
      try {
        return new Date(data.startDate) >= new Date(data.applicationClose);
      } catch {
        return false;
      }
    },
    {
      message: 'Round start date must be on or after application close date.',
      path: ['startDate'],
    },
  );

type RoundFormData = z.infer<typeof refinedRoundSchema>;

// More granular state management
type SubmissionStatus =
  | 'idle'
  | 'validating'
  | 'deploying_strategy' // Preparing/sending deployment tx
  | 'confirming_deployment' // Waiting for deployment tx receipt
  | 'approving_token' // Preparing/sending approval tx
  | 'confirming_approval' // Waiting for approval tx receipt
  | 'creating_pool' // Preparing/sending createPool tx
  | 'confirming_pool' // Waiting for createPool tx receipt
  | 'saving'
  | 'success'
  | 'error';

export default function CreateRoundPage() {
  const router = useRouter();
  const { address: connectedAddress, authenticated } = useAuth();
  const { chain, chainId } = useChain();
  const {
    writeContract,
    error: writeContractError,
    reset: resetWriteContract,
  } = useWriteContract();
  const {
    deployContract: deployStrategy,
    // data: deployTxHash,
    // isPending: isDeployingStrategy,
    error: deployError,
    reset: resetDeployContract,
  } = useDeployContract();

  // Form state and validation
  const form = useForm<RoundFormData>({
    resolver: zodResolver(refinedRoundSchema),
    defaultValues: {
      title: '',
      description: '',
      matchingPool: '0',
      tokenAddress: '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B', // USDC on Sepolia
      tokenDecimals: 6, // USDC default
      startDate: '',
      endDate: '',
      applicationStart: '',
      applicationClose: '',
      logoUrl: '',
      profileId:
        '0xa345e1bb3e9f075ca7261a5d496b531f4423e4913c2d516a08a8b1688f35e4b6', // Example profile ID
    },
  });

  // Component State
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [monitoredTxHash, setMonitoredTxHash] = useState<Hash | null>(null);
  const [finalRoundId, setFinalRoundId] = useState<number | null>(null);
  const [deployedStrategyAddress, setDeployedStrategyAddress] =
    useState<Address | null>(null);

  const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
  const [currentAllowance, setCurrentAllowance] = useState<bigint>(0n);
  const [requiredAmount, setRequiredAmount] = useState<bigint>(0n);
  const [needsApproval, setNeedsApproval] = useState(false);

  // Ref to store form data upon successful transaction submission
  const confirmedTxDataRef = useRef<RoundFormData | null>(null);

  const {
    watch,
    handleSubmit,
    setError,
    formState: { errors },
    getValues,
  } = form;
  const matchingPool = watch('matchingPool');
  const tokenAddress = watch('tokenAddress');
  const tokenDecimals = watch('tokenDecimals');

  // --- Transaction Confirmation Watcher ---
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isConfirmError,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: monitoredTxHash ?? undefined,
    query: {
      enabled:
        !!monitoredTxHash &&
        (status === 'confirming_deployment' ||
          status === 'confirming_approval' ||
          status === 'confirming_pool'),
    },
  });

  // --- Helper: Trigger Pool Creation ---
  const triggerCreatePool = useCallback(
    async (data: RoundFormData, strategyAddr: Address) => {
      console.log(
        '[Trigger Pool] Starting pool creation with strategy:',
        strategyAddr,
      );
      setStatus('creating_pool');
      setStatusMessage('Preparing pool creation transaction...');

      if (!connectedAddress) {
        setStatus('error');
        setStatusMessage('Cannot create pool: Wallet disconnected.');
        setError('root', { type: 'manual', message: 'Wallet disconnected.' });
        return;
      }

      try {
        // 1. Prepare Data (Dates, Amounts, Metadata) needed for prepareCreatePoolArgs
        const allocationStartTime = BigInt(
          Math.floor(new Date(data.startDate).getTime() / 1000),
        );
        const allocationEndTime = BigInt(
          Math.floor(new Date(data.endDate).getTime() / 1000),
        );
        const registrationStartTime = BigInt(
          Math.floor(new Date(data.applicationStart).getTime() / 1000),
        );
        const registrationEndTime = BigInt(
          Math.floor(new Date(data.applicationClose).getTime() / 1000),
        );
        const amount = parseUnits(data.matchingPool, data.tokenDecimals);

        // Metadata structure
        const metadataPointer = JSON.stringify({
          title: data.title,
          description: data.description,
          logo: data.logoUrl || '', // Ensure logo is string or empty string
        });
        const metadata = {
          protocol: 1n, // Allo protocol identifier (usually 1)
          pointer: metadataPointer,
        };

        // Initialization data structure for KickstarterQF
        const recipientInitializeData = {
          metadataRequired: true, // Or false based on your needs
          registrationStartTime,
          registrationEndTime,
        };
        const initializationData = {
          recipientInitializeData,
          allocationStartTime,
          allocationEndTime,
          withdrawalCooldown: 0n, // Example: No cooldown
          allowedTokens: [data.tokenAddress], // Only allow the pool's token
          isUsingAllocationMetadata: false, // KickstarterQF likely doesn't use this
        };

        // Managers (just the creator for now)
        const managers = [connectedAddress as `0x${string}`];

        // 2. Prepare Arguments using the imported helper function
        console.log('[Trigger Pool] Calling prepareCreatePoolArgs...');
        const createPoolArgs = prepareCreatePoolArgs({
          profileId: data.profileId,
          strategyImplementationAddress: strategyAddr, // Use the deployed strategy address
          initializationData: initializationData,
          token: data.tokenAddress,
          amount: amount,
          metadata: metadata,
          managers: managers,
        });
        console.log('[Trigger Pool] Args prepared:', createPoolArgs);

        // 3. Send Transaction using writeContract
        setStatusMessage('Please confirm pool creation in your wallet...');
        writeContract(
          {
            address: createPoolArgs.address as `0x${string}`,
            abi: createPoolArgs.abi,
            functionName: createPoolArgs.functionName,
            args: createPoolArgs.args,
          },
          {
            onSuccess: (hash) => {
              console.log('[Trigger Pool] Create pool tx sent:', hash);
              setMonitoredTxHash(hash);
            },
            onError: (error) => {
              // Error primarily handled by the useEffect hook watching writeContractError
              console.error(
                '[Trigger Pool] Create pool writeContract call failed:',
                error,
              );
              // Set status/message here as a fallback
              setStatus('error');
              const shortMessage =
                error instanceof BaseError
                  ? error.shortMessage
                  : error?.message;
              setStatusMessage(`Pool creation failed: ${shortMessage}`);
              setError('root', {
                type: 'manual',
                message: `Pool creation failed: ${shortMessage}`,
              });
            },
          },
        );
      } catch (error) {
        console.error('Error preparing create pool transaction:', error);
        setStatus('error');
        const message = `Failed to prepare pool creation: ${error instanceof Error ? error.message : 'Unknown error'}`;
        setStatusMessage(message);
        setError('root', { type: 'manual', message });
      }
      // Add dependencies used inside the callback
    },
    [connectedAddress, setError, writeContract],
  ); // Added AlloABI dependency

  const saveRoundData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (confirmedReceipt: any, data: RoundFormData) => {
      console.log('[Save Data] Starting save process...');
      if (!connectedAddress || !authenticated || !deployedStrategyAddress) {
        setStatus('error');
        setStatusMessage(
          'Required information missing for saving (address, chainId, or strategyAddress).',
        );
        setError('root', {
          type: 'manual',
          message: 'Internal error: Missing data for saving.',
        });
        console.error('[Save Data] Missing required info:', {
          connectedAddress,
          chainId,
          deployedStrategyAddress,
        });
        return;
      }

      // --- Parse Pool ID from Logs ---
      let parsedPoolId: bigint | null = null;
      try {
        console.log(
          '[Save Data] Parsing logs from receipt:',
          confirmedReceipt.logs,
        );
        for (const log of confirmedReceipt.logs) {
          if (log.address.toLowerCase() === ALLO_ADDRESS.toLowerCase()) {
            try {
              const decodedEvent = decodeEventLog({
                abi: AlloABI, // Use Allo ABI
                data: log.data,
                topics: log.topics,
              });
              console.log('[Save Data] Decoded log:', decodedEvent);
              if (decodedEvent.eventName === 'PoolCreated') {
                // Adjust according to the actual event structure in AlloABI
                parsedPoolId =
                  (decodedEvent.args as { poolId?: bigint }).poolId ?? null;
                console.log('[Save Data] Parsed Pool ID:', parsedPoolId);
                if (parsedPoolId !== null) break; // Exit loop once found
              }
            } catch (decodeError) {
              console.warn(
                "[Save Data] Ignoring log that doesn't match Allo PoolCreated event:",
                log,
                decodeError,
              );
            }
          }
        }
        if (parsedPoolId === null) {
          throw new Error(
            'PoolCreated event log not found or poolId missing in logs.',
          );
        }
      } catch (error) {
        console.error('[Save Data] Error parsing Pool ID:', error);
        setStatus('error');
        setStatusMessage(
          `Transaction confirmed, but failed to parse Pool ID: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        setError('root', {
          type: 'manual',
          message: 'Failed to process transaction logs.',
        });
        return; // Stop processing
      }

      // --- Call Server Action to Save ---
      console.log(
        '[Save Data] Calling server action with Pool ID:',
        parsedPoolId,
      );
      try {
        const result = await saveRoundAction({
          ...data, // Spread form data
          poolId: parsedPoolId,
          transactionHash: confirmedReceipt.transactionHash,
          strategyAddress: deployedStrategyAddress,
          blockchain: chain?.name || String(chainId), // Use chain name or ID
        });

        console.log('[Save Data] Server action result:', result);
        if (result.success && result.data?.roundId) {
          setStatus('success');
          setStatusMessage(
            `Round created and saved successfully! (ID: ${result.data.roundId})`,
          );
          setFinalRoundId(result.data.roundId);
          confirmedTxDataRef.current = null; // Clear stored data on final success
        } else {
          setStatus('error');
          setStatusMessage(
            `Failed to save round data: ${result.error || 'Unknown server error'}`,
          );
          setError('root', {
            type: 'manual',
            message: `Failed to save round data: ${result.error}`,
          });
        }
      } catch (serverError) {
        console.error('[Save Data] Error calling server action:', serverError);
        setStatus('error');
        const message =
          serverError instanceof Error
            ? serverError.message
            : 'Unknown server error';
        setStatusMessage(`Failed to save round data: ${message}`);
        setError('root', {
          type: 'manual',
          message: `Server error during save: ${message}`,
        });
      }
    },
    [
      connectedAddress,
      chainId,
      authenticated,
      deployedStrategyAddress,
      setError,
      chain?.name,
    ],
  );

  // --- Check Allowance Logic ---
  const handleCheckAllowance = useCallback(async () => {
    if (
      !connectedAddress ||
      !tokenAddress ||
      !matchingPool ||
      Number(matchingPool) <= 0 ||
      !z.string().startsWith('0x').safeParse(tokenAddress).success
    ) {
      setNeedsApproval(false);
      setCurrentAllowance(0n);
      setRequiredAmount(0n);
      return;
    }

    setIsCheckingAllowance(true);
    setNeedsApproval(false);
    try {
      const decimals = tokenDecimals || 6;
      const amount = parseUnits(matchingPool, decimals);
      setRequiredAmount(amount);

      const allowance = await checkErc20Allowance({
        tokenAddress: tokenAddress as Address,
        ownerAddress: connectedAddress as `0x${string}`,
        spenderAddress: ALLO_ADDRESS,
        chainId,
      });

      setCurrentAllowance(allowance);
      setNeedsApproval(allowance < amount);
    } catch (error) {
      console.error('Error checking allowance:', error);
      setStatusMessage(
        `Error checking allowance: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      setNeedsApproval(true);
    } finally {
      setIsCheckingAllowance(false);
    }
  }, [connectedAddress, tokenAddress, matchingPool, tokenDecimals, chainId]);

  // --- Approve Logic ---
  const handleApprove = useCallback(async () => {
    if (
      !connectedAddress ||
      !tokenAddress ||
      !z.string().startsWith('0x').safeParse(tokenAddress).success
    ) {
      setError('root', {
        type: 'manual',
        message: 'Valid Token Address is required for approval.',
      });
      return;
    }

    setStatus('approving_token');
    setStatusMessage('Requesting approval in wallet...');
    setMonitoredTxHash(null);
    resetWriteContract();

    try {
      const approveArgs = prepareApproveErc20Args({
        tokenAddress: tokenAddress as Address,
        spenderAddress: ALLO_ADDRESS,
        amount: maxUint256,
      });

      setStatusMessage(
        'Approving token... Tx sent. Waiting for confirmation...',
      );
      writeContract(
        {
          address: approveArgs.address as `0x${string}`,
          abi: approveArgs.abi,
          functionName: approveArgs.functionName,
          args: approveArgs.args,
        },
        {
          onSuccess: (hash) => {
            setStatus('approving_token');
            setStatusMessage(
              'Approving token... Tx sent. Waiting for confirmation...',
            );
            setMonitoredTxHash(hash);
          },
          onError: (error) => {
            // Error handled by the useEffect hook watching writeContractError
            console.error('Approval writeContract call failed:', error);
            setStatus('error');
            const shortMessage =
              error instanceof BaseError ? error.shortMessage : error?.message;
            setStatusMessage(`Approval failed: ${shortMessage}`);
            setError('root', {
              type: 'manual',
              message: `Approval failed: ${shortMessage}`,
            });
          },
        },
      );
    } catch (error) {
      console.error('Approval preparation failed:', error);
      setStatus('error');
      const message = `Failed to prepare approval: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setStatusMessage(message);
      setError('root', { type: 'manual', message });
    }
  }, [
    writeContract,
    resetWriteContract,
    tokenAddress,
    connectedAddress,
    setError,
  ]);

  useEffect(() => {
    console.log(
      `[Effect Check] Status: ${status}, Monitored Hash: ${monitoredTxHash}, isConfirming: ${isConfirming}, isConfirmed: ${isConfirmed}, getValues: ${getValues()}`,
    );

    // Handle Setting Confirmation Status (Only once per hash)
    if (monitoredTxHash && !isConfirming && !isConfirmed && !isConfirmError) {
      if (status === 'deploying_strategy') {
        setStatus('confirming_deployment');
        setStatusMessage('Waiting for strategy deployment confirmation...');
        console.log('[Effect Update] Status set to confirming_deployment');
      } else if (status === 'approving_token') {
        setStatus('confirming_approval');
        setStatusMessage('Waiting for approval confirmation...');
        console.log('[Effect Update] Status set to confirming_approval');
      } else if (status === 'creating_pool') {
        setStatus('confirming_pool');
        setStatusMessage('Waiting for pool creation confirmation...');
        console.log('[Effect Update] Status set to confirming_pool');
      }
    }

    // 2. Handle Successful Confirmations
    if (isConfirmed && receipt && monitoredTxHash) {
      console.log(`[Effect Confirmed] Status: ${status}, Receipt:`, receipt);

      // A. Strategy Deployment Confirmed
      if (status === 'confirming_deployment') {
        const contractAddress = receipt.contractAddress as Address;
        console.log(
          '[Effect Confirmed] Trying to extract contract address:',
          contractAddress,
        );
        if (contractAddress) {
          console.log(
            '[Effect Confirmed] Strategy deployed at:',
            contractAddress,
          );
          setDeployedStrategyAddress(contractAddress);
          setStatusMessage(
            `Strategy deployed at ${contractAddress}. Preparing pool creation...`,
          );
          setMonitoredTxHash(null); // Reset monitored hash *after* processing
          resetWriteContract(); // Reset regular write contract state

          // --> Automatically trigger pool creation
          triggerCreatePool(confirmedTxDataRef.current!, contractAddress); // Use stored form data
        } else {
          console.error(
            '[Effect Error] Strategy deployment confirmed but no contract address found in receipt:',
            receipt,
          );
          setStatus('error');
          setStatusMessage(
            'Strategy deployment failed: Could not determine contract address from receipt.',
          );
          setMonitoredTxHash(null); // Reset monitored hash
        }
      }
      // B. Approval Confirmed
      else if (status === 'confirming_approval') {
        console.log(
          '[Effect Confirmed] Approval confirmed:',
          receipt.transactionHash,
        );
        setStatusMessage('Approval confirmed. Ready to create round.');
        setMonitoredTxHash(null); // Reset monitored hash
        resetWriteContract();
        handleCheckAllowance(); // Re-check allowance
        // Set status back to idle, ready for the user to click Create Round again (which now proceeds to deploy)
        setStatus('idle');
        console.log('[Effect Update] Status set back to idle after approval.');
      }
      // C. Pool Creation Confirmed
      else if (status === 'confirming_pool') {
        console.log(
          '[Effect Confirmed] Pool creation confirmed:',
          receipt.transactionHash,
        );
        setStatus('saving');
        setStatusMessage('Pool creation confirmed. Saving round details...');
        setMonitoredTxHash(null); // Reset monitored hash
        resetWriteContract();

        // Proceed to save data
        saveRoundData(receipt, confirmedTxDataRef.current!);
      } else {
        console.warn(
          `[Effect Confirmed] Confirmation received in unexpected status: ${status}`,
        );
        // Optionally reset state if confirmation happened in an unknown state
        // setStatus('idle');
        // setMonitoredTxHash(null);
      }
    }

    // 3. Handle Transaction Confirmation Errors (from useWaitForTransactionReceipt)
    if (isConfirmError && monitoredTxHash) {
      console.error(
        `[Effect Error] Transaction confirmation failed for hash ${monitoredTxHash}:`,
        confirmError,
      );
      let errorType = 'Transaction Confirmation';
      if (status === 'confirming_deployment')
        errorType = 'Strategy Deployment Confirmation';
      else if (status === 'confirming_approval')
        errorType = 'Approval Confirmation';
      else if (status === 'confirming_pool')
        errorType = 'Pool Creation Confirmation';

      const shortMessage =
        confirmError instanceof BaseError
          ? confirmError.shortMessage
          : confirmError?.message;
      setStatus('error');
      setStatusMessage(`${errorType} failed: ${shortMessage}`);
      setError('root', {
        type: 'manual',
        message: `${errorType} failed. Check transaction link for details.`,
      });
      setMonitoredTxHash(null); // Reset monitored hash
    }

    // Add relevant dependencies
  }, [
    isConfirming,
    isConfirmed,
    isConfirmError,
    receipt,
    monitoredTxHash,
    status,
    confirmError,
    resetWriteContract,
    getValues,
    handleCheckAllowance,
    saveRoundData,
    setError,
    triggerCreatePool,
  ]);

  // --- Effect to handle hook errors (deployContract, writeContract) ---
  useEffect(() => {
    const hookError = deployError || writeContractError;
    if (hookError) {
      // Avoid overwriting specific confirmation errors if already set
      if (status !== 'error') {
        console.error('[Hook Error Effect] Error detected:', hookError);
        const errorSource = deployError
          ? 'Strategy Deployment'
          : 'Contract Interaction';
        const shortMessage =
          hookError instanceof BaseError
            ? hookError.shortMessage
            : hookError?.message;
        const message = hookError?.message?.includes('User rejected')
          ? 'Transaction rejected by user.'
          : `${errorSource} failed: ${shortMessage}`;

        setStatus('error');
        setStatusMessage(message);
        setError('root', { type: 'manual', message });
        // Reset relevant states if a hook fails early
        setMonitoredTxHash(null);
        confirmedTxDataRef.current = null;
      }
    }
  }, [deployError, writeContractError, setError, status]);

  // --- NEW: Effect for Detailed Connection Logging ---
  useEffect(() => {
    // Log detailed connection status whenever it changes
    console.log('Wagmi Connection Status Update:', {
      connectedAddress,
      chainId,
    });
    // Optional: Log Privy status
    // console.log("Privy Status Update:", { ready, authenticated, userId: user?.id });

    // Attempt to clear connection error if status becomes 'connected'
    if (
      authenticated &&
      connectedAddress &&
      chainId &&
      errors.root?.message?.includes('Please connect your wallet')
    ) {
      console.log(
        'Wallet connection detected, clearing connection error message.',
      );
      setError('root', { message: '' });
    }
  }, [
    authenticated,
    connectedAddress,
    chainId,
    errors.root?.message,
    setError /*, ready, authenticated, user */,
  ]);

  // --- Initial Allowance Check ---
  useEffect(() => {
    handleCheckAllowance();
  }, [handleCheckAllowance]);

  // --- Main Form Submission Handler ---
  const onSubmit = async (data: RoundFormData) => {
    // Reset status and errors first
    setStatus('validating');
    setStatusMessage(null);
    setError('root', { message: '' }); // Clear previous root errors
    setFinalRoundId(null);
    setDeployedStrategyAddress(null);
    setMonitoredTxHash(null);
    resetWriteContract();
    resetDeployContract();

    console.log('[onSubmit] Triggered. Checking wallet connection...');
    // Log current state directly from the hook when submit is pressed
    console.log('[onSubmit] Current Wagmi State:', {
      connectedAddress,
      chainId,
    });

    if (!authenticated) {
      console.error('[onSubmit] Wallet connection check failed.', {
        connectedAddress,
      });
      const message =
        "Please connect your wallet and ensure it's on the correct network.";
      setError('root', { type: 'manual', message });
      setStatus('idle'); // Go back to idle if wallet not ready
      return;
    }
    // *** END REVISED CHECK ***

    // Check approval status *before* starting deployment
    if (needsApproval && Number(data.matchingPool) > 0) {
      console.log('[onSubmit] Token approval required.');
      setError('root', {
        type: 'manual',
        message: 'Token approval required before creating the round.',
      });
      setStatus('idle'); // Go back to idle if approval needed
      return;
    }

    console.log(
      '[onSubmit] Wallet connected and approval checked. Proceeding to deploy strategy...',
    );
    setStatus('deploying_strategy');
    setStatusMessage('Preparing strategy deployment...');
    confirmedTxDataRef.current = data; // Store form data for later steps

    try {
      // Generate a unique name for this strategy
      const strategyName = `KickstarterQF-${data.title.replace(/\s+/g, '-').substring(0, 20)}-${Date.now()}`;

      // Ensure the bytecode being passed is the hex string from the 'object' property
      if (
        !KickStarterQFABI.bytecode ||
        typeof KickStarterQFABI.bytecode.object !== 'string' ||
        !KickStarterQFABI.bytecode.object.startsWith('0x')
      ) {
        throw new Error('Invalid bytecode format in KickStarterQFABI import.');
      }

      console.log('[onSubmit] Deploying strategy with name:', strategyName);
      // Use the deployContract hook's function
      deployStrategy(
        {
          abi: KickStarterQFABI.abi,
          // Access the 'object' property for the actual bytecode hex string
          bytecode: KickStarterQFABI.bytecode.object as `0x${string}`,
          args: [ALLO_ADDRESS, strategyName, false], // directTransfers = false
        },
        {
          onSuccess: (hash) => {
            // This hash is from the deploy hook, set it for monitoring
            console.log('[onSubmit] Strategy deployment tx sent:', hash);
            // Don't set status here, let the useEffect handle it based on the hash
            setMonitoredTxHash(hash);
          },
          onError: (error) => {
            // Error primarily handled by the useEffect hook watching deployError
            console.error(
              '[onSubmit] Strategy deployment deployContract call failed:',
              error,
            );
            // Set status/message here as a fallback if the hook's error watcher doesn't fire quickly
            setStatus('error');
            const shortMessage =
              error instanceof BaseError ? error.shortMessage : error?.message;
            setStatusMessage(`Strategy deployment failed: ${shortMessage}`);
            setError('root', {
              type: 'manual',
              message: `Strategy deployment failed: ${shortMessage}`,
            });
          },
        },
      );
    } catch (error) {
      console.error('Error preparing strategy deployment:', error);
      setStatus('error');
      const message = `Failed to prepare deployment: ${error instanceof Error ? error.message : 'Unknown error'}`;
      setStatusMessage(message);
      setError('root', { type: 'manual', message });
      confirmedTxDataRef.current = null; // Clear stored data on prep error
    }
  };

  // --- UI Logic ---
  const isProcessing =
    status !== 'idle' && status !== 'success' && status !== 'error';
  const isApproveButtonDisabled = isProcessing || !needsApproval;
  // Disable create button if processing, or if approval is needed (and pool > 0), or if wallet is not connected/ready
  const isCreateButtonDisabled =
    isProcessing ||
    (needsApproval && Number(matchingPool) > 0) ||
    !authenticated;

  const getAlertIcon = () => {
    if (status === 'error' || !!errors.root)
      return <AlertTriangle className="h-4 w-4" />;
    if (status === 'success') return <CheckCircle className="h-4 w-4" />;
    if (status === 'saving')
      return <Database className="h-4 w-4 animate-pulse" />;
    if (isProcessing) return <Loader2 className="h-4 w-4 animate-spin" />;
    return null; // Or a default icon for idle/info
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            href="/rounds"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Rounds
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Round</CardTitle>
            <CardDescription>
              Configure and launch a new funding round on Allo Protocol.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Round Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g., QF Round 1: Community Grants"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the goals, eligibility, and focus of this funding round."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="matchingPool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matching Pool Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="any"
                            placeholder="e.g., 10000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Initial funds provided by the round manager.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tokenAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Token Address</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Address of the ERC20 token used for matching and
                          contributions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tokenDecimals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Decimals</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="18" {...field} />
                        </FormControl>
                        <FormDescription>
                          Decimals of the funding token (e.g., 6 for USDC, 18
                          for DAI).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profileId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allo Profile ID</FormLabel>
                        <FormControl>
                          <Input placeholder="0x..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Your unique Allo Protocol profile identifier
                          (bytes32).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {Number(matchingPool) > 0 &&
                  tokenAddress &&
                  z.string().startsWith('0x').safeParse(tokenAddress)
                    .success && (
                    <div className="rounded-md border bg-muted p-4">
                      <h3 className="mb-2 text-sm font-medium">
                        Token Approval for Matching Pool
                      </h3>
                      {isCheckingAllowance ? (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Checking allowance...</span>
                        </div>
                      ) : needsApproval ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Current Allowance:{' '}
                              {formatUnits(
                                currentAllowance,
                                tokenDecimals || 6,
                              )}
                            </span>
                            <span className="font-medium">
                              Required:{' '}
                              {formatUnits(requiredAmount, tokenDecimals || 6)}
                            </span>
                          </div>
                          <Progress
                            value={
                              Number(requiredAmount) > 0
                                ? Number(
                                    (currentAllowance * 100n) / requiredAmount,
                                  )
                                : 100
                            }
                            className="h-2"
                          />
                          <Button
                            type="button"
                            onClick={handleApprove}
                            disabled={isApproveButtonDisabled}
                            size="sm"
                            className="w-full"
                          >
                            {(status === 'approving_token' ||
                              status === 'confirming_approval') && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {status === 'approving_token'
                              ? 'Requesting Approval...'
                              : status === 'confirming_approval'
                                ? 'Waiting for Approval...'
                                : 'Approve Max Token Spend'}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            You need to grant the Allo contract permission to
                            transfer your tokens for the matching pool.
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Sufficient allowance approved.</span>
                        </div>
                      )}
                    </div>
                  )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="applicationStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Start Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicationClose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application End Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round Start Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription>
                          Contributions can begin.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Round End Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription>Contributions end.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to the round&apos;s logo image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(statusMessage || errors.root?.message) && (
                  <Alert
                    variant={
                      status === 'error' || !!errors.root
                        ? 'destructive'
                        : status === 'success'
                          ? 'default'
                          : 'default'
                    }
                    className={
                      status === 'success'
                        ? 'border-green-500 text-green-700 dark:border-green-700 dark:text-green-400'
                        : ''
                    }
                  >
                    {getAlertIcon()}
                    <AlertTitle>
                      {status === 'error' || !!errors.root
                        ? 'Error'
                        : status === 'success'
                          ? 'Success'
                          : 'Info'}
                    </AlertTitle>
                    <AlertDescription>
                      {errors.root?.message || statusMessage}
                      {monitoredTxHash &&
                        chain?.blockExplorers?.default.url && (
                          <>
                            <br />
                            View transaction:{' '}
                            <a
                              href={`${chain.blockExplorers.default.url}/tx/${monitoredTxHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {monitoredTxHash.substring(0, 10)}...
                              {monitoredTxHash.substring(
                                monitoredTxHash.length - 8,
                              )}
                            </a>
                          </>
                        )}
                      {status === 'success' && finalRoundId && (
                        <>
                          <br />
                          <Button
                            variant="link"
                            className="mt-2 h-auto p-0 text-current"
                            onClick={() =>
                              router.push(`/rounds/${finalRoundId}`)
                            }
                          >
                            View Created Round
                          </Button>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/rounds')}
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreateButtonDisabled}>
                    {isProcessing && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {status === 'success'
                      ? 'Round Created'
                      : status === 'saving'
                        ? 'Saving...'
                        : status === 'confirming_pool'
                          ? 'Confirming Pool...'
                          : status === 'creating_pool'
                            ? 'Creating Pool...'
                            : status === 'confirming_approval'
                              ? 'Confirming Approval...'
                              : status === 'approving_token'
                                ? 'Approving...'
                                : status === 'confirming_deployment'
                                  ? 'Confirming Strategy...'
                                  : status === 'deploying_strategy'
                                    ? 'Deploying Strategy...'
                                    : status === 'validating'
                                      ? 'Validating...'
                                      : 'Create Round'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
