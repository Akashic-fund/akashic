import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

// manual/administrative change of a user's kyc
// TODO: should only be executed with some kind of signature from crowdsplit
export async function POST() {
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

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { isKycCompleted: true },
    });

    if (!updatedUser) {
      throw new ApiNotFoundError('User to update not found');
    }

    return response({
      success: true,
      message: 'KYC status set to completed',
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
