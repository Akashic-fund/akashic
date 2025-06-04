import { db } from '@/server/db';
import { ApiIntegrityError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitWebhookKycPostRequest } from '@/lib/crowdsplit/api/types';

// This webhook should be registered with Crowdsplit to receive KYC status updates

export async function POST(req: Request) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await req.text();
    const body: CrowdsplitWebhookKycPostRequest = JSON.parse(rawBody);

    // In production, verify the webhook signature from Crowdsplit
    // This is a security best practice to ensure the webhook is actually from Crowdsplit
    const signature = req.headers.get('crowdsplit-signature');
    if (crowdsplitService.verifySignature(signature, rawBody)) {
      throw new ApiIntegrityError('Invalid signature');
    }

    // Process the webhook based on the event type
    const { event, data } = body;

    if (event === 'kyc.status_updated') {
      const { customer_id: customerId, status } = data;

      if (!customerId) {
        throw new ApiIntegrityError('Missing customer ID');
      }

      console.log(
        'Received KYC webhook for customer:',
        customerId,
        'with status:',
        status,
      );

      // Update user KYC status if completed
      if (status === 'completed') {
        await db.user.updateMany({
          where: { crowdsplitCustomerId: customerId },
          data: { isKycCompleted: true },
        });
      }
    }

    // Always return 200 to acknowledge receipt of the webhook
    return response({ success: true });
  } catch (error: unknown) {
    return handleError(error);
  }
}
