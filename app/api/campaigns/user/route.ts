import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { response, handleError } from '@/lib/api/response';

import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { chainConfig } from '@/lib/web3/config/chain';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = chainConfig.rpcUrl;

export async function GET() {
  try {
    if (!FACTORY_ADDRESS || !RPC_URL) {
      throw new Error('Campaign factory address or RPC URL not configured');
    }

    const session = await checkAuth(['user']);

    const client = createPublicClient({
      chain: celoAlfajores,
      transport: http(RPC_URL),
    });

    // First, fetch all campaigns from the database
    const dbCampaigns = await db.campaign.findMany({
      where: {
        creatorAddress: session.user.address,
      },
      select: {
        id: true,
        title: true,
        description: true,
        fundingGoal: true,
        startTime: true,
        endTime: true,
        creatorAddress: true,
        status: true,
        transactionHash: true,
        campaignAddress: true,
        treasuryAddress: true,
        createdAt: true,
        updatedAt: true,
        images: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get campaign created events
    const events = await client.getLogs({
      address: FACTORY_ADDRESS as `0x${string}`,
      event: {
        type: 'event',
        name: 'CampaignInfoFactoryCampaignCreated',
        inputs: [
          { type: 'bytes32', name: 'identifierHash', indexed: true },
          { type: 'address', name: 'campaignInfoAddress', indexed: true },
          { type: 'address', name: 'owner' },
          { type: 'uint256', name: 'launchTime' },
          { type: 'uint256', name: 'deadline' },
          { type: 'uint256', name: 'goalAmount' },
        ],
      },
      fromBlock: 0n,
      toBlock: 'latest',
    });

    // Combine data from events and database
    const combinedCampaigns = dbCampaigns.map((dbCampaign) => {
      // For campaigns without transaction hash (draft, etc), use database values
      if (!dbCampaign.transactionHash) {
        return {
          ...dbCampaign,
          address: dbCampaign.campaignAddress || '',
          owner: dbCampaign.creatorAddress,
          launchTime: Math.floor(
            new Date(dbCampaign.startTime).getTime() / 1000,
          ).toString(),
          deadline: Math.floor(
            new Date(dbCampaign.endTime).getTime() / 1000,
          ).toString(),
          goalAmount: dbCampaign.fundingGoal,
          totalRaised: '0',
        };
      }

      // For campaigns with transaction hash, try to get blockchain data
      const event = events.find(
        (e: {
          transactionHash?: `0x${string}`;
          args?: {
            owner?: `0x${string}`;
            launchTime?: bigint;
            deadline?: bigint;
            goalAmount?: bigint;
          };
        }) =>
          e.transactionHash?.toLowerCase() ===
          dbCampaign.transactionHash?.toLowerCase(),
      );

      if (event && event.args) {
        return {
          ...dbCampaign,
          address: dbCampaign.campaignAddress || '',
          owner: event.args.owner || dbCampaign.creatorAddress,
          launchTime: String(
            event.args.launchTime ||
              Math.floor(new Date(dbCampaign.startTime).getTime() / 1000),
          ),
          deadline: String(
            event.args.deadline ||
              Math.floor(new Date(dbCampaign.endTime).getTime() / 1000),
          ),
          goalAmount: event.args.goalAmount
            ? (Number(event.args.goalAmount) / 1e18).toString()
            : dbCampaign.fundingGoal,
          totalRaised: '0',
        };
      }

      // Fallback to database values if event parsing fails
      return {
        ...dbCampaign,
        address: dbCampaign.campaignAddress || '',
        owner: dbCampaign.creatorAddress,
        launchTime: Math.floor(
          new Date(dbCampaign.startTime).getTime() / 1000,
        ).toString(),
        deadline: Math.floor(
          new Date(dbCampaign.endTime).getTime() / 1000,
        ).toString(),
        goalAmount: dbCampaign.fundingGoal,
        totalRaised: '0',
      };
    });

    return response({ campaigns: combinedCampaigns });
  } catch (error: unknown) {
    return handleError(error);
  }
}
