import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DbCampaign } from '@/types/campaign';
import { chainConfig } from '@/config/chain';
import { CampaignStatus } from '@/types/campaign';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = chainConfig.rpcUrl;

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  );

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured');
  }

  console.log('Uploading to Cloudinary with:', {
    cloudName,
    uploadPreset,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    },
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Cloudinary upload failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
    });
    throw new Error(`Cloudinary upload failed: ${errorData}`);
  }

  const data = await response.json();
  console.log('Cloudinary upload successful:', data);
  return data.secure_url;
}

async function getPublicClient() {
  if (!FACTORY_ADDRESS || !RPC_URL) {
    throw new Error('Campaign factory address or RPC URL not configured');
  }

  return createPublicClient({
    chain: {
      ...celoAlfajores,
      contracts: {
        multicall3: {
          address: '0xcA11bde05977b3631167028862bE2a173976CA11' as const,
          blockCreated: 14353601,
        },
      },
    },
    transport: http(RPC_URL),
    batch: {
      multicall: {
        batchSize: 1024,
        wait: 16,
      },
    },
  });
}

async function getCampaignCreatedEvents(
  client: ReturnType<typeof createPublicClient>,
) {
  return client.getLogs({
    address: FACTORY_ADDRESS as `0x${string}`,
    event: {
      type: 'event',
      name: 'CampaignInfoFactoryCampaignCreated',
      inputs: [
        { type: 'bytes32', name: 'identifierHash', indexed: true },
        { type: 'address', name: 'campaignInfoAddress', indexed: true },
      ],
    },
    fromBlock: 0n,
    toBlock: 'latest',
  });
}

type CampaignCreatedEvent = {
  args: {
    identifierHash?: `0x${string}`;
    campaignInfoAddress?: `0x${string}`;
  };
};

function formatCampaignData(
  dbCampaign: DbCampaign,
  event: CampaignCreatedEvent | undefined,
) {
  if (!event || !event.args) {
    console.error('No matching event found for campaign:', {
      campaignId: dbCampaign.id,
      campaignAddress: dbCampaign.campaignAddress,
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
    launchTime: Math.floor(
      new Date(dbCampaign.startTime).getTime() / 1000,
    ).toString(),
    deadline: Math.floor(
      new Date(dbCampaign.endTime).getTime() / 1000,
    ).toString(),
    goalAmount: dbCampaign.fundingGoal,
    totalRaised: '0',
    images: dbCampaign.images,
    slug: dbCampaign.slug,
    location: dbCampaign.location,
    category: dbCampaign.category,
    treasuryAddress: dbCampaign.treasuryAddress,
  };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fundingGoal = formData.get('fundingGoal') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const creatorAddress = formData.get('creatorAddress') as string;
    const statusRaw = formData.get('status') as string;
    const statusMap: Record<string, CampaignStatus> = {
      draft: CampaignStatus.DRAFT,
      pending_approval: CampaignStatus.PENDING_APPROVAL,
      active: CampaignStatus.ACTIVE,
      completed: CampaignStatus.COMPLETED,
      failed: CampaignStatus.FAILED,
    };
    const status = statusMap[statusRaw] || CampaignStatus.DRAFT;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const bannerImage = formData.get('bannerImage') as File | null;

    console.log('Creating campaign with data:', {
      title,
      description,
      fundingGoal,
      startTime,
      endTime,
      creatorAddress,
      status,
      location,
    });

    if (
      !title ||
      !description ||
      !fundingGoal ||
      !startTime ||
      !endTime ||
      !creatorAddress
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Generate a unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const uniqueSuffix = Date.now().toString(36);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    let imageUrl = null;
    if (bannerImage) {
      try {
        imageUrl = await uploadToCloudinary(bannerImage);
      } catch (imageError) {
        console.error('Error uploading image:', imageError);
        return NextResponse.json(
          {
            error: 'Image upload failed',
            details:
              imageError instanceof Error
                ? imageError.message
                : 'Unknown error',
          },
          { status: 422 },
        );
      }
    }

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        fundingGoal,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        creatorAddress,
        status,
        location: location || undefined,
        category: category || undefined,
        slug,
        images: imageUrl
          ? {
              create: {
                imageUrl,
                isMainImage: true,
              },
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    console.log('Campaign created successfully:', campaign);

    return NextResponse.json({ campaignId: campaign.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to create campaign. Details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    return NextResponse.json(
      {
        error: 'Failed to create campaign',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { status, transactionHash, campaignAddress, campaignId } = body;
    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 },
      );
    }

    const campaign = await prisma.campaign.update({
      where: {
        id: parseInt(campaignId),
      },
      data: {
        status,
        transactionHash,
        campaignAddress,
      },
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const rounds = searchParams.get('rounds') || 'false';
    const skip = (page - 1) * pageSize;

    // status active should be enforced if access-token is not admin
    const statusList =
      status === 'active'
        ? [CampaignStatus.ACTIVE]
        : status === 'all'
          ? [
              CampaignStatus.DRAFT,
              CampaignStatus.PENDING_APPROVAL,
              CampaignStatus.COMPLETED,
              CampaignStatus.ACTIVE,
            ]
          : [
              CampaignStatus.PENDING_APPROVAL,
              CampaignStatus.COMPLETED,
              CampaignStatus.ACTIVE,
            ];

    const [dbCampaigns, totalCount] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          status: {
            in: statusList,
          },
        },
        include: {
          images: true,
          RoundCampaigns: {
            include: {
              Round: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.campaign.count({
        where: {
          status: {
            in: statusList,
          },
        },
      }),
    ]);

    const client = await getPublicClient();
    // @ts-expect-error - client issue
    const events = await getCampaignCreatedEvents(client);

    const combinedCampaigns = dbCampaigns
      .filter(
        (
          campaign: DbCampaign & {
            RoundCampaigns?: Array<{ Round: { id: number; title: string } }>;
          },
        ) => campaign.transactionHash,
      )
      .map(
        (
          dbCampaign: DbCampaign & {
            RoundCampaigns?: Array<{ Round: { id: number; title: string } }>;
          },
        ) => {
          const event = events.find(
            (onChainCampaign) =>
              onChainCampaign.args?.campaignInfoAddress?.toLowerCase() ===
              dbCampaign.campaignAddress?.toLowerCase(),
          ) as CampaignCreatedEvent | undefined;
          if (rounds === 'true') {
            return formatCampaignData(
              {
                ...dbCampaign,
                rounds:
                  dbCampaign.RoundCampaigns?.map(({ Round }) => Round) ?? [],
              },
              event,
            );
          }
          return formatCampaignData(dbCampaign, event);
        },
      )
      .filter(Boolean);

    return NextResponse.json({
      campaigns: combinedCampaigns,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalItems: totalCount,
        hasMore: skip + pageSize < totalCount,
      },
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 },
    );
  }
}
