import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { ApiParameterError, ApiUpstreamError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import {
  validateCrowdSplitWebhookAuth,
  getWebhookAuthInfo,
} from '@/lib/crowdsplit/webhook-auth';
import { CrowdsplitWebhookPostRequest } from '@/lib/crowdsplit/api/types';

const debug = process.env.NODE_ENV !== 'production';

/**
 * CrowdSplit Unified Webhook Handler
 *
 * Handles ALL webhook events from CrowdSplit in a single endpoint.
 * Routes events internally based on event type:
 * - transaction.updated -> Payment processing
 * - kyc.status_updated -> KYC status updates
 *
 * This follows the same pattern as Stripe webhooks where one URL handles multiple event types.
 * Endpoint: /api/crowdsplit/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    debug && console.log('\n[CROWDSPLIT UNIFIED WEBHOOK] Received webhook');
    debug && console.log('[WEBHOOK] URL:', request.url);

    let webhookData;
    try {
      webhookData = JSON.parse(body);
    } catch (err) {
      throw new ApiParameterError('Invalid JSON body');
    }

    // Validate webhook authentication using shared utility
    const authResult = validateCrowdSplitWebhookAuth(
      request,
      body,
      webhookData,
    );
    if (!authResult.isValid) {
      throw new ApiParameterError('Invalid webhook authentication');
    }

    debug &&
      console.log(
        `[WEBHOOK] Authentication successful via ${authResult.method}: ${authResult.details}`,
      );

    // Extract event information - handle both formats
    const eventType =
      webhookData.data?.type || webhookData.event || webhookData.type;
    const eventData = webhookData.data || webhookData;

    debug &&
      console.log('[WEBHOOK] Event details:', {
        eventType,
        hasData: !!eventData,
        dataKeys: Object.keys(eventData || {}),
      });

    if (!eventType) {
      throw new ApiParameterError('Missing event type in webhook payload');
    }

    // Route events based on type
    let result;
    switch (eventType) {
      case 'transaction.updated':
        result = await handlePaymentEvent(eventData, webhookData);
        break;

      case 'kyc.status_updated':
        result = await handleKycEvent(eventData, webhookData);
        break;

      default:
        debug && console.log(`[WEBHOOK] Unhandled event type: ${eventType}`);
        result = {
          success: true,
          message: `Event type '${eventType}' received but not processed`,
          event_type: eventType,
        };
    }

    return response({
      success: true,
      received: true,
      event_type: eventType,
      authentication_method: authResult.method,
      ...result,
    });
  } catch (error: unknown) {
    debug && console.error('[CROWDSPLIT UNIFIED WEBHOOK] Error:', error);
    return handleError(error);
  }
}

/**
 * Handle payment transaction events (transaction.updated)
 */
async function handlePaymentEvent(eventData: any, webhookData: any) {
  const transactionId = eventData.id;
  const status = eventData.status;
  const subStatus = eventData.subStatus;
  const metadata = eventData.metadata;

  debug &&
    console.log('[PAYMENT] Processing payment event:', {
      transactionId,
      status,
      subStatus,
      hasMetadata: !!metadata,
    });

  if (!transactionId) {
    throw new ApiParameterError('Missing transaction ID in payment event');
  }

  try {
    // Find payment record by external ID
    const payment = await db.payment.findFirst({
      where: {
        externalId: transactionId,
        provider: { in: ['CROWDSPLIT', 'STRIPE'] }, // Legacy support
      },
    });

    if (!payment) {
      debug &&
        console.warn(
          '[PAYMENT] Payment record not found for transaction:',
          transactionId,
        );

      // Log recent payments for debugging
      const recentPayments = await db.payment.findMany({
        where: { provider: { in: ['CROWDSPLIT', 'STRIPE'] } },
        select: {
          id: true,
          externalId: true,
          status: true,
          provider: true,
          token: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      debug &&
        console.log('[PAYMENT] Recent payments for reference:', recentPayments);

      return {
        payment_found: false,
        transaction_id: transactionId,
        message: 'Payment record not found - could be external transaction',
      };
    }

    debug &&
      console.log(
        `[PAYMENT] Found payment: ID ${payment.id}, Provider: ${payment.provider}, Current Status: ${payment.status}, Token: ${payment.token}`,
      );

    // Map CrowdSplit status to our internal status
    let newStatus = 'pending';

    if (status === 'COMPLETED' && subStatus === 'CAPTURED') {
      newStatus = 'confirmed';
      debug && console.log('[PAYMENT] Payment fully completed and captured');
    } else if (status === 'COMPLETED') {
      newStatus = 'confirmed';
      debug && console.log('[PAYMENT] Payment completed');
    } else if (status === 'FAILED') {
      newStatus = 'failed';
      debug && console.log('[PAYMENT] Payment failed');
    } else if (status === 'CANCELLED' || status === 'CANCELED') {
      newStatus = 'canceled';
      debug && console.log('[PAYMENT] Payment canceled');
    } else {
      debug &&
        console.log(`[PAYMENT] Payment status: ${status} (keeping as pending)`);
    }

    debug &&
      console.log(
        `[PAYMENT] Updating payment status from '${payment.status}' to '${newStatus}'`,
      );

    // Update payment with new status and webhook metadata
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        metadata: {
          ...(payment.metadata as any),
          crowdsplitWebhookData: webhookData,
          lastWebhookStatus: status,
          lastWebhookSubStatus: subStatus,
          webhookMetadata: metadata,
          webhookProcessedAt: new Date().toISOString(),
          paymentMethod: payment.token === 'USD' ? 'credit_card' : 'crypto',
        },
      },
    });

    debug &&
      console.log(
        `[PAYMENT] Payment status updated successfully to '${newStatus}'`,
      );

    return {
      payment_found: true,
      payment_id: payment.id,
      transaction_id: transactionId,
      old_status: payment.status,
      new_status: newStatus,
      message: 'Payment status updated successfully',
    };
  } catch (error) {
    debug && console.error('[PAYMENT] Error processing payment event:', error);
    throw error;
  }
}

/**
 * Handle KYC status events (kyc.status_updated)
 */
async function handleKycEvent(eventData: any, webhookData: any) {
  // Handle both webhook formats
  const kycData = eventData.data || eventData;
  const customerId = kycData.customer_id;
  const status = kycData.status;

  debug &&
    console.log('[KYC] Processing KYC event:', {
      customerId,
      status,
      eventFormat: eventData.data ? 'nested' : 'flat',
    });

  if (!customerId) {
    throw new ApiParameterError('Missing customer ID in KYC event');
  }

  debug &&
    console.log(
      `[KYC] Processing KYC update for customer: ${customerId}, status: ${status}`,
    );

  try {
    // Update user KYC status if completed
    if (status === 'completed') {
      const updatedUsers = await db.user.updateMany({
        where: { crowdsplitCustomerId: customerId },
        data: { isKycCompleted: true },
      });

      debug &&
        console.log(
          `[KYC] Updated KYC status for ${updatedUsers.count} user(s)`,
        );

      return {
        kyc_updated: true,
        customer_id: customerId,
        status,
        users_updated: updatedUsers.count,
        message: 'KYC status updated successfully',
      };
    } else {
      debug && console.log(`[KYC] KYC status '${status}' - no action needed`);

      return {
        kyc_updated: false,
        customer_id: customerId,
        status,
        message: `KYC status '${status}' received but no database update needed`,
      };
    }
  } catch (error) {
    debug && console.error('[KYC] Error processing KYC event:', error);
    throw error;
  }
}

/**
 * GET handler for webhook endpoint information and health check
 */
export async function GET() {
  const authInfo = getWebhookAuthInfo();

  return NextResponse.json({
    success: true,
    message: 'CrowdSplit unified webhook endpoint',
    endpoint: '/api/crowdsplit/webhook',
    description:
      'Single webhook endpoint that handles all CrowdSplit events and routes them internally by event type',
    supported_events: [
      {
        type: 'transaction.updated',
        description:
          'Payment transaction updates from CrowdSplit (both Stripe and Bridge.xyz)',
        handler: 'handlePaymentEvent',
      },
      {
        type: 'kyc.status_updated',
        description: 'KYC status updates from CrowdSplit',
        handler: 'handleKycEvent',
      },
    ],
    supported_payment_methods: [
      'credit_card (via Stripe)',
      'crypto/stablecoins (via Bridge.xyz)',
    ],
    routing: {
      method: 'internal_event_routing',
      description:
        'Events are routed internally based on event type, similar to Stripe webhooks',
    },
    documentation: {
      readme: '/api/crowdsplit/webhook/README.md',
      note: 'Register this single URL with CrowdSplit for all webhook events',
    },
    ...authInfo,
  });
}
