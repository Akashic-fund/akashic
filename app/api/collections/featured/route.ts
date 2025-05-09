import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CampaignImage } from '@/types/campaign';

// Get featured collections
export async function GET() {
  try {
    // For now, we'll just return the most recent collections with items
    // In a real implementation, you might have a "featured" flag or curated list
    const collections = await prisma.collection.findMany({
      take: 6,
      where: {
        campaigns: {
          some: {}, // Only collections that have at least one campaign
        },
      },
      include: {
        campaigns: {
          take: 4, // Limit to 4 campaigns for the preview
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
    const collectionsWithDetails = collections.map((collection) => {
      return {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        createdAt: collection.createdAt,
        userId: collection.userId,
        items: collection.campaigns.map((campaignCollection) => {
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
                campaign.images.find((img: CampaignImage) => img.isMainImage)
                  ?.imageUrl || '/images/placeholder.svg',
            },
          };
        }),
      };
    });

    return NextResponse.json({ collections: collectionsWithDetails });
  } catch (error) {
    console.error('Error fetching featured collections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured collections' },
      { status: 500 },
    );
  }
}
