import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitWebhookKycPostRequest } from '@/lib/crowdsplit/api/types';

// This webhook should be registered with Crowdsplit to receive KYC status updates

export async function POST(request: NextRequest) {
  try {
    // Get the raw request body for signature verification
    const rawBody = await request.text();
    const body: CrowdsplitWebhookKycPostRequest = JSON.parse(rawBody);

    // In production, verify the webhook signature from Crowdsplit
    // This is a security best practice to ensure the webhook is actually from Crowdsplit
    const signature = request.headers.get('crowdsplit-signature');
    if (crowdsplitService.verifySignature(signature, rawBody)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process the webhook based on the event type
    const { event, data } = body;

    if (event === 'kyc.status_updated') {
      const { customer_id: customerId, status } = data;

      if (!customerId) {
        return NextResponse.json(
          { error: 'Missing customer ID' },
          { status: 400 },
        );
      }

      console.log(
        'Received KYC webhook for customer:',
        customerId,
        'with status:',
        status,
      );

      // Update user KYC status if completed
      if (status === 'completed') {
        await prisma.user.updateMany({
          where: { crowdsplitCustomerId: customerId },
          data: { isKycCompleted: true },
        });
      }
    }

    // Always return 200 to acknowledge receipt of the webhook
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing KYC webhook:', error);
    // Still return 200 to avoid Crowdsplit retrying the webhook unnecessarily
    // You would handle the error internally (e.g., log it for investigation)
    return NextResponse.json({
      success: false,
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
