import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

// Toggle favorite status
export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const { campaignId } = await req.json();
    if (!campaignId) {
      throw new ApiParameterError('CampaignId is missing');
    }

    // Check if favorite already exists
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userAddress_campaignId: {
          userAddress: session.user.address,
          campaignId: Number(campaignId),
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite if it exists
      await db.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return response({ isFavorite: false });
    } else {
      // Add favorite if it doesn't exist
      await db.favorite.create({
        data: {
          userAddress: session.user.address,
          campaignId: Number(campaignId),
        },
      });
      return response({ isFavorite: true });
    }
  } catch (error: unknown) {
    return handleError(error);
  }
}

// Get favorite status for a campaign
export async function GET(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const searchParams = new URL(req.url).searchParams;
    const campaignId = searchParams.get('campaignId');
    if (!campaignId) {
      throw new ApiParameterError('CampaignId is missing');
    }

    const favorite = await db.favorite.findUnique({
      where: {
        userAddress_campaignId: {
          userAddress: session.user.address,
          campaignId: Number(campaignId),
        },
      },
    });

    return response({ isFavorite: !!favorite });
  } catch (error: unknown) {
    return handleError(error);
  }
}
