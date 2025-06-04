import { db } from '@/server/db';
import {
  ApiAuthError,
  ApiNotFoundError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import crypto from 'crypto';
import { CROWDSPLIT_CLIENT_SECRET } from '@/lib/constant';

export async function POST(req: Request) {
  try {
    // Verify webhook signature if Crowdsplit provides one
    const signature = req.headers.get('x-crowdsplit-signature');
    const payload = await req.text();
    if (!signature) {
      throw new ApiParameterError('Missing Signature');
    }
    if (CROWDSPLIT_CLIENT_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', CROWDSPLIT_CLIENT_SECRET);
      const digest = hmac.update(payload).digest('hex');

      if (digest !== signature) {
        throw new ApiAuthError('Invalid signature');
      }
    }

    const data = JSON.parse(payload);
    const { event, transaction_id, status } = data;
    console.log('Crowdsplit webhook received:', {
      event,
      transaction_id,
      status,
    });

    // Handle different webhook events
    if (event === 'transaction.update' && transaction_id) {
      // Find the corresponding payment in your database
      const payment = await db.payment.findFirst({
        where: {
          provider: 'CROWDSPLIT',
          externalId: transaction_id,
        },
      });

      if (!payment) {
        throw new ApiNotFoundError('Payment not found for transaction');
      }

      // Map Crowdsplit status to your payment status
      let paymentStatus;
      switch (status) {
        case 'completed':
          paymentStatus = 'confirmed';
          break;
        case 'failed':
          paymentStatus = 'failed';
          break;
        default:
          paymentStatus = 'pending';
      }

      // Update payment status
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          metadata: {
            ...(payment.metadata as unknown as Record<string, unknown>),
            webhookData: data,
          },
        },
      });
    }

    return response({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
