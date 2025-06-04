import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError, ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { RecipientStatus } from '@/types/round';
// import { ApplicationStatus } from "@/lib/qfInteractions"

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['admin']);
    const { roundId, updates } = await req.json();
    const managerAddress = session.user.address;

    if (!roundId || !updates || !Array.isArray(updates)) {
      throw new ApiParameterError('Missing required parameters');
    }

    // Verify the user is an admin for this round
    const round = await db.round.findFirst({
      where: {
        id: roundId,
        managerAddress,
      },
    });

    if (!round) {
      throw new ApiNotFoundError('Round not found');
    }

    // Update each recipient status
    const updatePromises = updates.map(({ address }: { address: string }) =>
      db.roundCampaigns.updateMany({
        where: {
          roundId,
          Campaign: {
            creatorAddress: address,
          },
        },
        data: {
          status: RecipientStatus.PENDING,
          reviewedAt: new Date(),
        },
      }),
    );

    await Promise.all(updatePromises);

    return response({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
