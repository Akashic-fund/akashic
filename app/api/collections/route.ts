import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { PostCollectionsBody } from '@/lib/api/types';
import { CampaignImage, CampaignStatus } from '@/types/campaign';

// Get all collections for the current user
export async function GET() {
  try {
    const session = await checkAuth(['user']);

    const collections = await db.collection.findMany({
      where: {
        userId: session.user.address,
      },
      include: {
        campaigns: {
          where: {
            campaign: {
              status: CampaignStatus.ACTIVE,
            },
          },
          include: {
            campaign: {
              include: {
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format in the frontend
    const collectionsWithDetails = collections.map(
      (collection: {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        userId: string;
        campaigns: Array<{
          campaign: {
            id: number;
            title: string;
            description: string;
            slug: string;
            campaignAddress: string | null;
            images: Array<CampaignImage>;
          };
        }>;
      }) => {
        return {
          id: collection.id,
          name: collection.name,
          description: collection.description,
          createdAt: collection.createdAt,
          items: collection.campaigns.map(
            (campaignCollection: {
              campaign: {
                id: number;
                title: string;
                description: string;
                slug: string;
                campaignAddress: string | null;
                images: Array<CampaignImage>;
              };
            }) => {
              const campaign = campaignCollection.campaign;
              return {
                itemId: campaign.campaignAddress || String(campaign.id),
                itemType: 'campaign',
                details: {
                  id: campaign.id,
                  title: campaign.title,
                  description: campaign.description,
                  slug: campaign.slug,
                  image:
                    campaign.images.find(
                      (img: CampaignImage) => img.isMainImage,
                    )?.imageUrl || '/images/placeholder.svg',
                },
              };
            },
          ),
        };
      },
    );

    return response({ collections: collectionsWithDetails });
  } catch (error: unknown) {
    return handleError(error);
  }
}
// Create a new collection
export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const body: PostCollectionsBody = await req.json();
    const { name, description } = body;

    if (typeof name !== 'string' || !name.trim().length) {
      throw new ApiParameterError('Collection name is required');
    }

    // Check if collection with this name already exists for the user
    const existingCollection = await db.collection.findFirst({
      where: {
        userId: session.user.address,
        name,
      },
    });

    if (existingCollection) {
      throw new ApiParameterError(
        'Collection with this name is already exists',
      );
    }

    // Create the new collection
    const collection = await db.collection.create({
      data: {
        name,
        description: description || '',
        userId: session.user.address,
      },
    });

    console.log('Collection created:', collection);
    return response({ collection });
  } catch (error: unknown) {
    return handleError(error);
  }
}
