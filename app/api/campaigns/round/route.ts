import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { PostCampaignsRouteBody } from '@/lib/api/types';
export async function POST(req: Request) {
  try {
    await checkAuth(['admin']);

    const { campaignId, roundIds }: PostCampaignsRouteBody = await req.json();
    if (!campaignId) {
      throw new ApiParameterError('campaignId is required');
    }
    if (!roundIds || !Array.isArray(roundIds)) {
      throw new ApiParameterError('roundIds is required');
    }

    // Create entries in the RoundCampaigns table
    const roundCampaigns = await Promise.all(
      roundIds.map((roundId) =>
        db.roundCampaigns.create({
          data: {
            Campaign: { connect: { id: campaignId } },
            Round: { connect: { id: roundId } },
          },
        }),
      ),
    );
    return response({
      roundCampaigns,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
