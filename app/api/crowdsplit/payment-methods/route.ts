import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import {
  ApiNotFoundError,
  ApiUpstreamError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';

import { CrowdsplitPaymentMethodsPostRequest } from '@/lib/crowdsplit/api/types';

// GET endpoint to fetch payment methods from Prisma and enrich from crowdsplit service
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
    // Fetch payment methods from Prisma
    const paymentMethods = await db.paymentMethod.findMany({
      where: { userId: user.id },
    });
    // Fetch payment details from crowdsplit
    const crowdsplitPaymentMethodDetailsPromises = [];
    for (const paymentMethod of paymentMethods) {
      if (!paymentMethod.externalId) {
        continue;
      }
      crowdsplitPaymentMethodDetailsPromises.push(
        crowdsplitService.getPaymentMethod({
          id: paymentMethod.externalId,
          customerId: user.crowdsplitCustomerId,
        }),
      );
    }
    const crowdsplitPaymentMethodDetails = await Promise.all(
      crowdsplitPaymentMethodDetailsPromises,
    );
    return response({
      paymentMethods: paymentMethods.map(
        (paymentMethod: {
          id: number;
          externalId: string;
          provider: string;
          type: string;
          userId: number;
          createdAt: Date;
          updatedAt: Date;
        }) => {
          const crowdsplitDetails =
            crowdsplitPaymentMethodDetails.find(
              ({ id }) => id === paymentMethod.externalId,
            ) ?? null;
          const details = crowdsplitDetails?.bankDetails ?? null;
          return {
            ...paymentMethod,
            details,
          };
        },
      ),
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}

// POST endpoint to add a new payment method
export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const { type, provider, bankDetails }: CrowdsplitPaymentMethodsPostRequest =
      await req.json();

    console.log('Received payment method request:', {
      type,
      provider,
    });

    if (!!type || !provider || !bankDetails) {
      throw new ApiParameterError('missing required fields');
    }

    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }
    // Ensure we're sending exactly the format Crowdsplit expects

    // Create payment method in Crowdsplit
    const crowdsplitResponse = await crowdsplitService.createPaymentMethod({
      customerId: user.crowdsplitCustomerId,
      type,
      bankDetails,
    });

    if (!crowdsplitResponse.id) {
      throw new ApiUpstreamError(
        'Failed to create payment method in Crowdsplit',
      );
    }

    // Save payment method to Prisma
    const paymentMethod = await db.paymentMethod.create({
      data: {
        provider,
        externalId: crowdsplitResponse.id,
        type,
        user: { connect: { id: user.id } },
      },
    });

    return response({ success: true, paymentMethod });
  } catch (error: unknown) {
    return handleError(error);
  }
}
