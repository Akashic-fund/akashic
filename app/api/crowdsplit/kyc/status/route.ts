import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';

interface KycStatusData {
  status: string;
}

export async function GET() {
  try {
    const session = await checkAuth(['user']);

    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }

    // Get the KYC status from Crowdsplit API
    const statusData: KycStatusData = (await crowdsplitService.getKycStatus(
      user.crowdsplitCustomerId,
    )) as KycStatusData;
    const status = statusData.status || 'pending';

    // If KYC is completed according to Crowdsplit, update our database
    if (status === 'completed' && !user.isKycCompleted) {
      await db.user.update({
        where: { id: user.id },
        data: { isKycCompleted: true },
      });
    }

    return response({
      status,
      customerId: user.crowdsplitCustomerId,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
