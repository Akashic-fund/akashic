import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiAuthNotAllowed, ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const data = await req.json();
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    const payment = await db.payment.create({
      data: {
        amount: data.amount,
        token: data.token,
        isAnonymous: data.isAnonymous,
        status: data.status,
        transactionHash: data.transactionHash,
        type: data.type ?? 'BUY',
        user: { connect: { id: user.id } },
        campaign: { connect: { id: data.campaignId } },
      },
    });

    return response({ paymentId: payment.id });
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const data = await req.json();

    const instance = await db.payment.findUnique({
      where: { id: data.paymentId },
    });
    if (!instance) {
      throw new ApiNotFoundError('Payment not found');
    }
    if (instance.userId !== session.user.dbId) {
      throw new ApiAuthNotAllowed('Session not allowed to modify this payment');
    }
    const payment = await db.payment.update({
      where: { id: data.paymentId },
      data: {
        status: data.status,
        transactionHash: data.transactionHash,
      },
    });

    return response({ payment });
  } catch (error: unknown) {
    return handleError(error);
  }
}
