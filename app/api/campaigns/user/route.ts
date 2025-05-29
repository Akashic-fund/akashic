import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { chainConfig } from '@/config/chain';
import { CampaignStatus } from '@/types/campaign';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = chainConfig.rpcUrl;

type DbCampaign = {
  id: number;
  description: string;
  title: string;
  fundingGoal: string;
  startTime: Date;
  endTime: Date;
  creatorAddress: string;
  status: string;
  transactionHash: string | null;
  campaignAddress: string | null;
  treasuryAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: number;
    imageUrl: string;
    isMainImage: boolean;
    campaignId: number;
  }[];
};

export async function GET(request: Request) {
  try {
    if (!FACTORY_ADDRESS || !RPC_URL) {
      throw new Error('Campaign factory address or RPC URL not configured');
    }

    const { searchParams } = new URL(request.url);
    const creatorAddress = searchParams.get('address');
    console.log('Creator address:', creatorAddress);

    if (!creatorAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 },
      );
    }

    const client = createPublicClient({
      chain: celoAlfajores,
      transport: http(RPC_URL),
    });

    // First, fetch all campaigns from the database
    const dbCampaigns = await prisma.campaign.findMany({
      where: {
        creatorAddress,
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
    const combinedCampaigns = dbCampaigns.map((dbCampaign: DbCampaign) => {
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

    return NextResponse.json({ campaigns: combinedCampaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 },
    );
  }
}
export async function PATCH(request: Request) {
  console.warn('[deprecated] use PATCH /api/campaigns instead');
  try {
    const body = await request.json();
    const { campaignId, status, transactionHash, campaignAddress } = body;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 },
      );
    }

    type UpdateData = {
      status?: CampaignStatus;
      transactionHash?: string;
      campaignAddress?: string;
    };

    const updateData: UpdateData = {};
    if (status) {
      const statusMap: Record<string, CampaignStatus> = {
        draft: CampaignStatus.DRAFT,
        pending_approval: CampaignStatus.PENDING_APPROVAL,
        active: CampaignStatus.ACTIVE,
        completed: CampaignStatus.COMPLETED,
        failed: CampaignStatus.FAILED,
      };
      updateData.status = statusMap[status] || CampaignStatus.DRAFT;
    }
    if (transactionHash) updateData.transactionHash = transactionHash;
    if (campaignAddress) updateData.campaignAddress = campaignAddress;

    const campaign = await prisma.campaign.update({
      where: {
        id: Number(campaignId),
      },
      data: updateData,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 },
    );
  }
}
