import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureUserExists } from '@/lib/user-helpers';
import { CampaignImage, CampaignStatus } from '@/types/campaign';

// Get all collections for the current user
export async function GET(req: NextRequest) {
  try {
    // Get user address from query params or headers
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: userAddress,
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

    return NextResponse.json({ collections: collectionsWithDetails });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collections' },
      { status: 500 },
    );
  }
}

// Create a new collection
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, userAddress } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 },
      );
    }

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    console.log('Creating collection:', { name, description, userAddress });

    try {
      // Ensure the user exists
      const userStatus = await ensureUserExists(userAddress);
      console.log('User status:', userStatus);

      // Check if collection with this name already exists for the user
      const existingCollection = await prisma.collection.findFirst({
        where: {
          userId: userAddress,
          name,
        },
      });

      if (existingCollection) {
        return NextResponse.json(
          { error: 'Collection with this name already exists' },
          { status: 400 },
        );
      }

      // Create the new collection
      const collection = await prisma.collection.create({
        data: {
          name,
          description: description || '',
          userId: userAddress,
        },
      });

      console.log('Collection created:', collection);
      return NextResponse.json({ collection });
    } catch (dbError) {
      console.error('Database error creating collection:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to create collection',
          details:
            dbError instanceof Error
              ? dbError.message
              : 'Unknown database error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      {
        error: 'Failed to create collection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
