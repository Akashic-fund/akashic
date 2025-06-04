import { db } from '@/server/db';
import { checkAuth, isAdmin } from '@/lib/api/auth';
import {
  ApiParameterError,
  ApiUpstreamError,
  ApiAuthNotAllowed,
  ApiNotFoundError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { DbCampaign } from '@/types/campaign';
import { chainConfig } from '@/lib/web3/config/chain';
import { CampaignStatus } from '@/types/campaign';

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;
const RPC_URL = chainConfig.rpcUrl;
const statusMap: Record<string, CampaignStatus> = {
  draft: CampaignStatus.DRAFT,
  pending_approval: CampaignStatus.PENDING_APPROVAL,
  active: CampaignStatus.ACTIVE,
  completed: CampaignStatus.COMPLETED,
  failed: CampaignStatus.FAILED,
};
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
  forceEvent = true,
) {
  if (forceEvent && (!event || !event.args)) {
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
    totalRaised:
      dbCampaign.payments?.reduce((accumulator, payment) => {
        const value = Number(payment.amount);
        if (isNaN(value)) {
          return accumulator;
        }
        return accumulator + value;
      }, 0) ?? 0,
    images: dbCampaign.images,
    slug: dbCampaign.slug,
    location: dbCampaign.location,
    category: dbCampaign.category,
    treasuryAddress: dbCampaign.treasuryAddress,
  };
}

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const creatorAddress = session.user.address;

    const formData = await req.formData();

    // Extract form fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fundingGoal = formData.get('fundingGoal') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const statusRaw = formData.get('status') as string;

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
      throw new ApiParameterError('missing required fields');
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
        throw new ApiUpstreamError('Image upload failed');
      }
    }

    const campaign = await db.campaign.create({
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

    return response({ campaignId: campaign.id });
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const body = await req.json();
    const {
      status: statusRaw,
      transactionHash,
      campaignAddress,
      campaignId,
    } = body;
    if (!campaignId) {
      throw new ApiParameterError('campaignId is required');
    }
    const status = statusMap[statusRaw] || undefined;
    if (
      ![
        CampaignStatus.FAILED,
        CampaignStatus.PENDING_APPROVAL,
        CampaignStatus.DRAFT,
        undefined,
      ].includes(status)
    ) {
      // its only possible to set the whitelisted status to prevent api-calls that
      // make the campaign active.
      throw new ApiParameterError('Requested status update not allowed');
    }
    const instance = await db.campaign.findUnique({
      where: {
        id: parseInt(campaignId),
      },
    });
    if (!instance) {
      throw new ApiNotFoundError('Campaign not found');
    }
    if (instance.creatorAddress !== session?.user?.address) {
      throw new ApiAuthNotAllowed('User cannot modify this campaign');
    }
    const campaign = await db.campaign.update({
      where: {
        id: instance.id,
      },
      data: {
        status,
        transactionHash,
        campaignAddress,
      },
    });

    return response(campaign);
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const rounds = searchParams.get('rounds') || 'false';
    const syncChain = searchParams.get('sync-chain') || 'false';
    const skip = (page - 1) * pageSize;
    if (pageSize > 10) {
      throw new ApiParameterError('Maximum Page size exceeded');
    }
    const forceEvents = syncChain === 'true' ? true : false;
    // status active should be enforced if access-token is not admin
    const admin = await isAdmin();
    const statusList = !admin
      ? [CampaignStatus.ACTIVE]
      : status === 'active'
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
      db.campaign.findMany({
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
          payments: {
            // requires amount to be numeric: _sum: { amount: true },
            where: { token: 'USDC', type: 'BUY', status: 'confirmed' },
          },
        },
        skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      db.campaign.count({
        where: {
          status: {
            in: statusList,
          },
        },
      }),
    ]);
    let events: CampaignCreatedEvent[] = [];
    if (forceEvents) {
      const client = await getPublicClient();
      // @ts-expect-error - client issue
      events = await getCampaignCreatedEvents(client);
    }
    const combinedCampaigns = dbCampaigns
      .filter((campaign) => campaign.transactionHash)
      .map((dbCampaign) => {
        const event = events.find(
          (onChainCampaign) =>
            onChainCampaign.args?.campaignInfoAddress?.toLowerCase() ===
            dbCampaign.campaignAddress?.toLowerCase(),
        ) as CampaignCreatedEvent | undefined;
        if (rounds === 'true') {
          return formatCampaignData(
            {
              ...dbCampaign,
              status: dbCampaign.status,
              rounds:
                dbCampaign.RoundCampaigns?.map(({ Round }) => ({
                  id: Round.id,
                  title: Round.title,
                })) ?? [],
            },
            event,
            forceEvents,
          );
        }
        return formatCampaignData(dbCampaign, event, forceEvents);
      })
      .filter(Boolean);

    return response({
      campaigns: combinedCampaigns,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
        totalItems: totalCount,
        hasMore: skip + pageSize < totalCount,
      },
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
