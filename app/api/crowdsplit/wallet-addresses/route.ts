import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const session = await checkAuth(['user']);

    const { walletAddress } = data;
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }
    // Call the Crowdsplit API to associate the wallet address with the customer
    if (walletAddress) {
      await crowdsplitService.associatWallet({
        customerId: user.crowdsplitCustomerId,
        walletAddress,
        walletType: 'ETH',
      });
    }

    // Update the user with the recipient wallet address
    await db.user.update({
      where: { address: session.user.address },
      data: { recipientWallet: walletAddress },
    });

    return response({
      success: true,
      message: 'Wallet address added successfully',
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
