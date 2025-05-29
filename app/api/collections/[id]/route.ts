import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CampaignImage } from '@/types/campaign';

// Get a specific collection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Get user address from query params
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    // Find the collection without requiring user ownership
    const collection = await prisma.collection.findUnique({
      where: {
        id: (await params).id,
      },
      include: {
        campaigns: {
          include: {
            campaign: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 },
      );
    }

    // Check if the user is the owner
    const isOwner = userAddress && collection.userId === userAddress;

    // Transform the data to match the expected format in the frontend
    const collectionWithDetails = {
      ...collection,
      isOwner,
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
                campaign.images.find((img: CampaignImage) => img.isMainImage)
                  ?.imageUrl || '/images/placeholder.svg',
            },
          };
        },
      ),
    };

    return NextResponse.json({ collection: collectionWithDetails });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 },
    );
  }
}

// Update a collection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, userAddress } = body;

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    // Check if collection exists and belongs to the user
    const existingCollection = await prisma.collection.findUnique({
      where: {
        id,
        userId: userAddress,
      },
    });

    if (!existingCollection) {
      return NextResponse.json(
        {
          error:
            'Collection not found or you do not have permission to edit it',
        },
        { status: 404 },
      );
    }

    // Check if new name conflicts with another collection
    if (name && name !== existingCollection.name) {
      const nameConflict = await prisma.collection.findFirst({
        where: {
          userId: userAddress,
          name,
          id: { not: id },
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Collection with this name already exists' },
          { status: 400 },
        );
      }
    }

    const updatedCollection = await prisma.collection.update({
      where: {
        id,
      },
      data: {
        name: name || existingCollection.name,
        description:
          description !== undefined
            ? description
            : existingCollection.description,
      },
    });

    return NextResponse.json({ collection: updatedCollection });
  } catch (error) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 },
    );
  }
}

// Delete a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Get user address from query params
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    try {
      // First, check if the user exists in the database
      let user = await prisma.user.findUnique({
        where: {
          address: userAddress,
        },
      });

      // If user doesn't exist, create them
      if (!user) {
        console.log("User doesn't exist, creating new user:", userAddress);
        user = await prisma.user.create({
          data: {
            address: userAddress,
            // No name field in the schema
          },
        });
        console.log('User created:', user);
      }

      // Check if collection exists and belongs to the user
      const existingCollection = await prisma.collection.findUnique({
        where: {
          id,
          userId: userAddress,
        },
      });

      if (!existingCollection) {
        return NextResponse.json(
          {
            error:
              'Collection not found or you do not have permission to delete it',
          },
          { status: 404 },
        );
      }

      // First delete all campaign associations
      await prisma.campaignCollection.deleteMany({
        where: {
          collectionId: id,
        },
      });

      // Then delete the collection
      await prisma.collection.delete({
        where: {
          id,
        },
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error deleting collection:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to delete collection',
          details:
            dbError instanceof Error
              ? dbError.message
              : 'Unknown database error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete collection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
