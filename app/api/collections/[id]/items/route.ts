import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import {
  ApiParameterError,
  ApiAuthNotAllowed,
  ApiNotFoundError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import {
  CollectionsWithIdParams,
  DeleteCollectionsWithIdBody,
} from '@/lib/api/types';
// Add an item to a collection
export async function POST(req: Request, { params }: CollectionsWithIdParams) {
  try {
    const session = await checkAuth(['user']);
    const { id } = await params;
    const body = await req.json();
    const { itemId, itemType } = body;
    const userAddress = session.user.address;

    console.log('Adding item to collection:', {
      collectionId: id,
      itemId,
      itemType,
      userAddress,
      paramsReceived: params,
    });

    if (!itemId || !itemType) {
      throw new ApiParameterError('missing required fields');
    }

    // First, check if the user exists in the database
    const user = await db.user.findUnique({
      where: {
        address: session.user.address,
      },
    });
    if (!user) {
      throw new ApiNotFoundError('Session user does not exist');
    }

    // Check if collection exists and belongs to the user
    const collection = await db.collection.findUnique({
      where: {
        id,
      },
    });
    if (!collection) {
      throw new ApiNotFoundError('Collection does not exist');
    }
    if (collection.userId !== session.user.address) {
      throw new ApiAuthNotAllowed(
        'User does not have permission to modify collection',
      );
    }

    // Find the campaign by address or ID
    let campaign;

    // First try to find by campaign address
    campaign = await db.campaign.findUnique({
      where: {
        campaignAddress: itemId,
      },
    });

    // If not found by address, try to find by ID
    if (!campaign) {
      // Try to parse the ID as a number if it's a string
      const numericId =
        typeof itemId === 'string' ? parseInt(itemId, 10) || 0 : itemId;

      campaign = await db.campaign.findFirst({
        where: {
          OR: [{ id: numericId }, { slug: itemId }],
        },
      });
    }

    if (!campaign) {
      throw new ApiNotFoundError('Campaign not found');
    }
    console.log('Found campaign:', campaign);

    // Check if campaign already exists in the collection
    const existingItem = await db.campaignCollection.findUnique({
      where: {
        campaignId_collectionId: {
          campaignId: campaign.id,
          collectionId: id,
        },
      },
    });

    if (existingItem) {
      throw new ApiParameterError('Campaign already exists in this collection');
    }

    // Add the campaign to the collection
    const campaignCollection = await db.campaignCollection.create({
      data: {
        campaign: { connect: { id: campaign.id } },
        collection: { connect: { id } },
      },
    });

    console.log('Item added to collection:', campaignCollection);
    return response({ item: campaignCollection });
  } catch (error: unknown) {
    return handleError(error);
  }
}

// Remove an item from a collection
export async function DELETE(
  req: Request,
  { params }: CollectionsWithIdParams,
) {
  try {
    const session = await checkAuth(['user']);
    const { id } = await params;
    const body: DeleteCollectionsWithIdBody = await req.json();
    const { itemId } = body;

    if (!itemId) {
      throw new ApiParameterError('itemId is required');
    }

    // Check if collection exists and belongs to the user
    const collection = await db.collection.findUnique({
      where: {
        id,
      },
    });

    if (!collection) {
      throw new ApiNotFoundError('Collection not found');
    }
    if (collection.userId !== session.user.address) {
      throw new ApiAuthNotAllowed(
        'User does not have permission to modify collection',
      );
    }

    // Find the campaign by address
    const campaign = await db.campaign.findUnique({
      where: {
        campaignAddress: itemId,
      },
    });

    if (!campaign) {
      throw new ApiNotFoundError('Campaign not found');
    }

    // Remove the campaign from the collection
    await db.campaignCollection.delete({
      where: {
        campaignId_collectionId: {
          campaignId: campaign.id,
          collectionId: id,
        },
      },
    });

    return response({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
