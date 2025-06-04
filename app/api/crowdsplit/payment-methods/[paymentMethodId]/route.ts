import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiAuthNotAllowed, ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitPaymentMethodGetParams } from '@/lib/crowdsplit/api/types';

export async function GET(
  req: Request,
  { params }: CrowdsplitPaymentMethodGetParams,
) {
  try {
    const session = await checkAuth(['user']);
    const paymentMethodId = parseInt((await params).paymentMethodId);
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }

    const paymentMethod = await db.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });
    if (!paymentMethod) {
      throw new ApiNotFoundError('Payment Method not found');
    }
    if (paymentMethod.userId !== user.id) {
      throw new ApiAuthNotAllowed('Payment Method not accessible by user');
    }
    if (!paymentMethod.externalId) {
      return response({ paymentMethod });
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }
    const crowdsplitPaymentMethod = await crowdsplitService.getPaymentMethod({
      id: paymentMethod.externalId,
      customerId: user.crowdsplitCustomerId,
    });
    const details = crowdsplitPaymentMethod?.bankDetails ?? null;

    return response({
      paymentMethod: {
        ...paymentMethod,
        details,
      },
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function DELETE(
  req: Request,
  { params }: CrowdsplitPaymentMethodGetParams,
) {
  try {
    const session = await checkAuth(['user']);
    const paymentMethodId = parseInt((await params).paymentMethodId);
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }

    const paymentMethod = await db.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });
    if (!paymentMethod) {
      throw new ApiNotFoundError('Payment Method not found');
    }
    if (paymentMethod.userId !== user.id) {
      throw new ApiAuthNotAllowed('Payment Method not accessible by user');
    }
    if (!paymentMethod.externalId) {
      await db.paymentMethod.delete({ where: { id: paymentMethodId } });
      return response({ success: true });
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }
    await crowdsplitService.deletePaymentMethod(
      paymentMethod.externalId,
      user.crowdsplitCustomerId,
    );
    await db.paymentMethod.delete({ where: { id: paymentMethodId } });

    return response({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
