import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// This webhook should be registered with Bridge to receive KYC status updates

export async function POST(request: NextRequest) {
    try {
        // Get the raw request body for signature verification
        const rawBody = await request.text();
        const body = JSON.parse(rawBody);

        // In production, verify the webhook signature from Bridge
        // This is a security best practice to ensure the webhook is actually from Bridge
        const signature = request.headers.get('bridge-signature');
        if (process.env.NODE_ENV === 'production' && !verifyBridgeSignature(signature, rawBody)) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Process the webhook based on the event type
        const { event, data } = body;

        if (event === 'kyc.status_updated') {
            const { customer_id, status } = data;

            if (!customer_id) {
                return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
            }

            console.log('Received KYC webhook for customer:', customer_id, 'with status:', status);

            // Update user KYC status if completed
            if (status === 'completed') {
                await prisma.user.updateMany({
                    where: { bridgeCustomerId: customer_id },
                    data: { isKycCompleted: true }
                });
            }
        }

        // Always return 200 to acknowledge receipt of the webhook
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing KYC webhook:', error);
        // Still return 200 to avoid Bridge retrying the webhook unnecessarily
        // You would handle the error internally (e.g., log it for investigation)
        return NextResponse.json({
            success: false,
            error: 'Failed to process webhook',
            details: error instanceof Error ? error.message : String(error)
        });
    }
}

// Verify the Bridge webhook signature
function verifyBridgeSignature(signature: string | null, payload: string): boolean {
    if (!signature || !process.env.BRIDGE_WEBHOOK_SECRET) {
        return false;
    }

    const hmac = crypto.createHmac('sha256', process.env.BRIDGE_WEBHOOK_SECRET);
    const expectedSignature = hmac.update(payload).digest('hex');

    // Convert Buffers to Uint8Array objects for timingSafeEqual
    return crypto.timingSafeEqual(
        new Uint8Array(Buffer.from(signature)),
        new Uint8Array(Buffer.from(expectedSignature))
    );
} 