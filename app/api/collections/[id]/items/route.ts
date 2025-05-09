import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add an item to a collection
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { itemId, itemType, userAddress } = body;

    console.log('Adding item to collection:', {
      collectionId: id,
      itemId,
      itemType,
      userAddress,
      paramsReceived: params,
    });

    if (!itemId || !itemType) {
      return NextResponse.json(
        { error: 'Item ID and type are required' },
        { status: 400 },
      );
    }

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
          },
        });
        console.log('User created:', user);
      }

      // Check if collection exists and belongs to the user
      const collection = await prisma.collection.findUnique({
        where: {
          id,
          userId: userAddress,
        },
      });

      if (!collection) {
        console.log("Collection not found or user doesn't have permission:", {
          collectionId: id,
          userAddress,
          collectionsForUser: await prisma.collection.findMany({
            where: { userId: userAddress },
            select: { id: true, name: true },
          }),
        });

        return NextResponse.json(
          {
            error:
              'Collection not found or you do not have permission to modify it',
            details: `Collection with ID ${id} not found for user ${userAddress}`,
          },
          { status: 404 },
        );
      }

      // Find the campaign by address or ID
      let campaign;

      // First try to find by campaign address
      campaign = await prisma.campaign.findUnique({
        where: {
          campaignAddress: itemId,
        },
      });

      // If not found by address, try to find by ID
      if (!campaign) {
        // Try to parse the ID as a number if it's a string
        const numericId =
          typeof itemId === 'string' ? parseInt(itemId, 10) || 0 : itemId;

        campaign = await prisma.campaign.findFirst({
          where: {
            OR: [{ id: numericId }, { slug: itemId }],
          },
        });
      }

      if (!campaign) {
        return NextResponse.json(
          {
            error: 'Campaign not found',
            details: `Could not find campaign with ID or address: ${itemId}`,
          },
          { status: 404 },
        );
      }

      console.log('Found campaign:', campaign);

      // Check if campaign already exists in the collection
      const existingItem = await prisma.campaignCollection.findUnique({
        where: {
          campaignId_collectionId: {
            campaignId: campaign.id,
            collectionId: id,
          },
        },
      });

      if (existingItem) {
        return NextResponse.json(
          { error: 'Campaign already exists in this collection' },
          { status: 400 },
        );
      }

      // Add the campaign to the collection
      const campaignCollection = await prisma.campaignCollection.create({
        data: {
          campaignId: campaign.id,
          collectionId: id,
        },
      });

      console.log('Item added to collection:', campaignCollection);
      return NextResponse.json({ item: campaignCollection });
    } catch (dbError) {
      console.error('Database error adding item to collection:', dbError);
      return NextResponse.json(
        {
          error: 'Failed to add item to collection',
          details:
            dbError instanceof Error
              ? dbError.message
              : 'Unknown database error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error adding item to collection:', error);
    return NextResponse.json(
      {
        error: 'Failed to add item to collection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// Remove an item from a collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { itemId, userAddress } = body;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 },
      );
    }

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    // Check if collection exists and belongs to the user
    const collection = await prisma.collection.findUnique({
      where: {
        id,
        userId: userAddress,
      },
    });

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 },
      );
    }

    // Find the campaign by address
    const campaign = await prisma.campaign.findUnique({
      where: {
        campaignAddress: itemId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // Remove the campaign from the collection
    await prisma.campaignCollection.delete({
      where: {
        campaignId_collectionId: {
          campaignId: campaign.id,
          collectionId: id,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing item from collection:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from collection' },
      { status: 500 },
    );
  }
}
