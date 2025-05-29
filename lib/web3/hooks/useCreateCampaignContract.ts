import { useEffect, useCallback } from 'react';
import { useAccount } from '@/contexts';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Log, parseEther, keccak256, stringToHex } from 'viem';
import { CampaignInfoFactoryABI } from '@/contracts/abi/CampaignInfoFactory';

const campaignInfoFactory = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
export interface IOnCreateCampaignConfirmed {
  hash: string;
  status: string;
  campaignAddress: string;
  event?: Log<bigint, number, false>;
}
export function useCreateCampaignContract({
  onConfirmed,
}: {
  onConfirmed: (arg0: IOnCreateCampaignConfirmed) => void;
}) {
  const { address } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });
  const createCampaignContract = useCallback(
    async ({
      startTime,
      endTime,
      fundingGoal,
    }: {
      startTime: string;
      endTime: string;
      fundingGoal: string;
    }) => {
      const campaignData = {
        launchTime: BigInt(new Date(startTime ?? '').getTime() / 1000),
        deadline: BigInt(new Date(endTime ?? '').getTime() / 1000),
        goalAmount: parseEther(fundingGoal || '0'),
      };

      // Then proceed with blockchain transaction
      const identifierHash = keccak256(stringToHex('KickStarter'));
      writeContract({
        address: campaignInfoFactory as `0x${string}`,
        abi: CampaignInfoFactoryABI,
        functionName: 'createCampaign',
        args: [
          address,
          identifierHash,
          [process.env.NEXT_PUBLIC_PLATFORM_HASH as `0x${string}`],
          [], // Platform data keys
          [], // Platform data values
          campaignData,
        ],
      });
    },
    [address, writeContract],
  );

  useEffect(() => {
    if (hash && isSuccess && receipt) {
      const campaignAddress = receipt.logs[0].address;
      const status = receipt.status;
      const event = receipt.logs.find(
        (log: Log) => log.transactionHash === hash,
      );
      onConfirmed({ hash, status, campaignAddress, event });
    }
  }, [hash, isSuccess, receipt, onConfirmed]);
  return {
    isPending,
    isConfirming,
    isSuccess,
    createCampaignContract,
    createCampaignContractHash: hash,
  };
}
