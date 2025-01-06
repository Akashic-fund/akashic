import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

export async function GET(request: Request) {
    try {
        if (!FACTORY_ADDRESS || !RPC_URL) {
            throw new Error('Campaign factory address or RPC URL not configured');
        }

        const { searchParams } = new URL(request.url);
        const creatorAddress = searchParams.get('creatorAddress');

        const client = createPublicClient({
            chain: celoAlfajores,
            transport: http(RPC_URL)
        });

        // First, fetch all campaigns from the database
        const dbCampaigns = await prisma.campaign.findMany({
            where: {
                ...(creatorAddress ? { creatorAddress } : {}), // Filter by creator if provided
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
            }
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
                    { type: 'uint256', name: 'goalAmount' }
                ]
            },
            fromBlock: 0n,
            toBlock: 'latest'
        });

        // Combine data from events and database
        const combinedCampaigns = dbCampaigns.map(dbCampaign => {
            // For campaigns without transaction hash (draft, etc), use database values
            if (!dbCampaign.transactionHash) {
                return {
                    ...dbCampaign,
                    address: dbCampaign.campaignAddress || '',
                    owner: dbCampaign.creatorAddress,
                    launchTime: Math.floor(new Date(dbCampaign.startTime).getTime() / 1000).toString(),
                    deadline: Math.floor(new Date(dbCampaign.endTime).getTime() / 1000).toString(),
                    goalAmount: dbCampaign.fundingGoal,
                    totalRaised: '0'
                };
            }

            // For campaigns with transaction hash, try to get blockchain data
            const event = events.find(e =>
                e.transactionHash?.toLowerCase() === dbCampaign.transactionHash?.toLowerCase()
            );

            if (event && event.args) {
                return {
                    ...dbCampaign,
                    address: dbCampaign.campaignAddress || '',
                    owner: event.args.owner || dbCampaign.creatorAddress,
                    launchTime: String(event.args.launchTime || Math.floor(new Date(dbCampaign.startTime).getTime() / 1000)),
                    deadline: String(event.args.deadline || Math.floor(new Date(dbCampaign.endTime).getTime() / 1000)),
                    goalAmount: event.args.goalAmount ? (Number(event.args.goalAmount) / 1e18).toString() : dbCampaign.fundingGoal,
                    totalRaised: '0'
                };
            }

            // Fallback to database values if event parsing fails
            return {
                ...dbCampaign,
                address: dbCampaign.campaignAddress || '',
                owner: dbCampaign.creatorAddress,
                launchTime: Math.floor(new Date(dbCampaign.startTime).getTime() / 1000).toString(),
                deadline: Math.floor(new Date(dbCampaign.endTime).getTime() / 1000).toString(),
                goalAmount: dbCampaign.fundingGoal,
                totalRaised: '0'
            };
        });

        return NextResponse.json({ campaigns: combinedCampaigns });
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return NextResponse.json(
            { error: 'Failed to fetch campaigns' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json()
        const { campaignId, status, transactionHash, campaignAddress } = body

        if (!campaignId) {
            return NextResponse.json(
                { error: 'Campaign ID is required' },
                { status: 400 }
            )
        }

        type UpdateData = {
            status?: string;
            transactionHash?: string;
            campaignAddress?: string;
        }

        const updateData: UpdateData = {};
        if (status) updateData.status = status;
        if (transactionHash) updateData.transactionHash = transactionHash;
        if (campaignAddress) updateData.campaignAddress = campaignAddress;

        const campaign = await prisma.campaign.update({
            where: {
                id: Number(campaignId)
            },
            data: updateData
        })

        return NextResponse.json(campaign)
    } catch (error) {
        console.error('Failed to update campaign:', error)
        return NextResponse.json(
            { error: 'Failed to update campaign' },
            { status: 500 }
        )
    }
}