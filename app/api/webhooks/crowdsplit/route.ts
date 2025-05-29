import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { CROWDSPLIT_CLIENT_SECRET } from '@/lib/constant';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature if Crowdsplit provides one
    const signature = request.headers.get('x-crowdsplit-signature');
    const payload = await request.text();

    if (CROWDSPLIT_CLIENT_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', CROWDSPLIT_CLIENT_SECRET);
      const digest = hmac.update(payload).digest('hex');

      if (digest !== signature) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 },
        );
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
      const payment = await prisma.payment.findFirst({
        where: {
          provider: 'CROWDSPLIT',
          externalId: transaction_id,
        },
      });

      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found for transaction' },
          { status: 404 },
        );
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
      await prisma.payment.update({
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Crowdsplit webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
