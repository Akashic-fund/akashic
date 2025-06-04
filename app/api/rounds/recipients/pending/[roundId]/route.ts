import { db } from '@/server/db';
import { ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { RoundsWithRoundIdParams } from '@/lib/api/types';

export async function GET(req: Request, { params }: RoundsWithRoundIdParams) {
  try {
    // public endpoint
    const resolvedParams = await params;
    const roundId = parseInt(resolvedParams.roundId, 10);

    if (isNaN(roundId)) {
      throw new ApiParameterError('Invalid round id parameters');
    }

    const recipients = await db.roundCampaigns.findMany({
      where: {
        roundId,
      },
      include: {
        Campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    // TODO: recipents.length === 0 because of invalid round-id?
    return response({ success: true, recipients });
  } catch (error: unknown) {
    return handleError(error);
  }
}
