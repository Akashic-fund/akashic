import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DbCampaign } from '@/types/campaign'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}


async function getPublicClient() {
  if (!FACTORY_ADDRESS || !RPC_URL) {
    throw new Error('Campaign factory address or RPC URL not configured');
  }
  
  return createPublicClient({
    chain: celoAlfajores,
    transport: http(RPC_URL),
    batch: {
      multicall: true
    }
  });
}

async function getActiveCampaigns() {
  return prisma.campaign.findMany({
    where: {
      status: {
        in: ['active', 'pending_approval']
      }
    },
    include: {
      images: true
    }
  });
}

async function getCampaignCreatedEvents(client: ReturnType<typeof createPublicClient>) {
  return client.getLogs({
    address: FACTORY_ADDRESS as `0x${string}`,
    event: {
      type: 'event',
      name: 'CampaignInfoFactoryCampaignCreated',
      inputs: [
        { type: 'bytes32', name: 'identifierHash', indexed: true },
        { type: 'address', name: 'campaignInfoAddress', indexed: true }
      ]
    },
    fromBlock: 0n,
    toBlock: 'latest'
  });
}

type CampaignCreatedEvent = {
  args: {
    identifierHash: `0x${string}`,
    campaignInfoAddress: `0x${string}`
  }
}

function formatCampaignData(dbCampaign: DbCampaign, event: CampaignCreatedEvent | undefined) {
  if (!event || !event.args) {
    console.error('No matching event found for campaign:', {
      campaignId: dbCampaign.id,
      campaignAddress: dbCampaign.campaignAddress
    });
    return null;
  }

  return {
    id: dbCampaign.id,
    title: dbCampaign.title,
    description: dbCampaign.description,
    status: dbCampaign.status,
    address: dbCampaign.campaignAddress,
    owner: dbCampaign.creatorAddress,
    launchTime: Math.floor(new Date(dbCampaign.startTime).getTime() / 1000).toString(),
    deadline: Math.floor(new Date(dbCampaign.endTime).getTime() / 1000).toString(),
    goalAmount: dbCampaign.fundingGoal,
    totalRaised: '0',
    images: dbCampaign.images,
    slug: dbCampaign.slug,
    location: dbCampaign.location
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // Extract form fields
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const fundingGoal = formData.get('fundingGoal') as string
    const startTime = formData.get('startTime') as string
    const endTime = formData.get('endTime') as string
    const creatorAddress = formData.get('creatorAddress') as string
    const status = formData.get('status') as string
    const location = formData.get('location') as string
    const bannerImage = formData.get('bannerImage') as File | null

    console.log(title, description, fundingGoal, startTime, endTime, creatorAddress, status, location, bannerImage)

    // Generate a unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    let imageUrl = null
    if (bannerImage) {
      try {
        // Create a unique filename
        const bytes = new Uint8Array(8)
        crypto.getRandomValues(bytes)
        const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
        const fileName = `${uniqueId}-${bannerImage.name}`
        
        // Ensure the campaign-images directory exists
        const imagePath = join(process.cwd(), 'public', 'campaign-images')
        await ensureDirectoryExists(imagePath)
        
        // Save the file to public/campaign-images
        const arrayBuffer = await bannerImage.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)
        await writeFile(join(imagePath, fileName), buffer)
        
        imageUrl = `/campaign-images/${fileName}`
      } catch (imageError) {
        console.error('Error processing image:', imageError)
        return NextResponse.json(
          { 
            error: 'Failed to process campaign image',
            details: imageError instanceof Error ? imageError.message : 'Unknown error processing image'
          },
          { status: 500 }
        )
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        slug,
        title,
        description,
        fundingGoal,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        creatorAddress,
        status,
        location: location || undefined,
        images: imageUrl ? {
          create: {
            imageUrl,
            isMainImage: true
          }
        } : undefined
      },
      include: {
        images: true
      }
    });

    return NextResponse.json({ campaignId: campaign.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign. Details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const body = await request.json()
    const { status, transactionHash, campaignAddress, campaignId } = body

    const campaign = await prisma.campaign.update({
      where: {
        id: parseInt(campaignId)
      },
      data: {
        status,
        transactionHash,
        campaignAddress
      },
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

export async function GET() {
  try {
    const client = await getPublicClient();
    const [dbCampaigns, events] = await Promise.all([
      getActiveCampaigns(),
      // @ts-expect-error - Ignoring viem type mismatch for chain compatibility
      getCampaignCreatedEvents(client)
    ]);
    
    const combinedCampaigns = dbCampaigns
      .filter((campaign) => campaign.transactionHash)
      .map((dbCampaign) => {
        const event = events.find(onChainCampaign =>
          onChainCampaign.args?.campaignInfoAddress?.toLowerCase() === dbCampaign.campaignAddress?.toLowerCase()
        ) as CampaignCreatedEvent | undefined;
        return formatCampaignData(dbCampaign, event);
      })
      .filter(Boolean);

    return NextResponse.json({ campaigns: combinedCampaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}