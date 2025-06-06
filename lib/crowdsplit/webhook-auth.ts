import { NextRequest } from 'next/server';
import { ApiParameterError, ApiUpstreamError } from '@/lib/api/error';
import crypto from 'crypto';

const CROWDSPLIT_WEBHOOK_SECRET = process.env.CROWDSPLIT_WEBHOOK_SECRET;
const debug = process.env.NODE_ENV !== 'production';

export interface WebhookAuthResult {
  isValid: boolean;
  method: string;
  details: string;
}

/**
 * Validate CrowdSplit webhook authentication using multiple methods
 * Supports both current payload-based and future HMAC SHA256 header-based authentication
 */
export function validateCrowdSplitWebhookAuth(
  request: NextRequest,
  body: string,
  webhookData: any,
): WebhookAuthResult {
  if (!CROWDSPLIT_WEBHOOK_SECRET) {
    throw new ApiUpstreamError('CrowdSplit webhook secret not configured');
  }

  // Method 1: Payload-based secret validation (current CrowdSplit method)
  const payloadSecret = webhookData.secret;
  if (payloadSecret) {
    const isPayloadValid = validatePayloadSecret(
      payloadSecret,
      CROWDSPLIT_WEBHOOK_SECRET,
    );
    if (isPayloadValid) {
      debug && console.log('✅ Payload secret authentication successful');
      return {
        isValid: true,
        method: 'payload_secret',
        details: 'Payload secret matches environment variable',
      };
    }
    debug && console.log('❌ Payload secret authentication failed');
  }

  // Method 2: HMAC SHA256 header-based validation (future-ready)
  const signatureHeader =
    request.headers.get('x-crowdsplit-signature') ||
    request.headers.get('x-signature') ||
    request.headers.get('signature');

  if (signatureHeader) {
    const isSignatureValid = validateHmacSignature(
      signatureHeader,
      body,
      CROWDSPLIT_WEBHOOK_SECRET,
    );
    if (isSignatureValid) {
      debug && console.log('✅ HMAC signature authentication successful');
      return {
        isValid: true,
        method: 'hmac_sha256',
        details: 'HMAC SHA256 signature validated successfully',
      };
    }
    debug && console.log('❌ HMAC signature authentication failed');
  }

  // Method 3: Stripe-style signature validation (future compatibility)
  const stripeSignature = request.headers.get('stripe-signature');
  if (stripeSignature) {
    const isStripeValid = validateStripeStyleSignature(
      stripeSignature,
      body,
      CROWDSPLIT_WEBHOOK_SECRET,
    );
    if (isStripeValid) {
      debug &&
        console.log('✅ Stripe-style signature authentication successful');
      return {
        isValid: true,
        method: 'stripe_style',
        details: 'Stripe-style signature validated successfully',
      };
    }
    debug && console.log('❌ Stripe-style signature authentication failed');
  }

  // If no authentication method succeeded
  if (!payloadSecret && !signatureHeader && !stripeSignature) {
    throw new ApiParameterError(
      'Missing webhook authentication (no secret in payload or signature headers)',
    );
  }

  return {
    isValid: false,
    method: 'none',
    details: 'All authentication methods failed',
  };
}

/**
 * Validate payload-based secret using constant-time comparison
 */
function validatePayloadSecret(received: string, expected: string): boolean {
  if (!received || !expected) return false;

  const receivedBuffer = new Uint8Array(Buffer.from(received, 'utf8'));
  const expectedBuffer = new Uint8Array(Buffer.from(expected, 'utf8'));

  if (receivedBuffer.length !== expectedBuffer.length) return false;

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

/**
 * Validate HMAC SHA256 signature from headers
 */
function validateHmacSignature(
  signature: string,
  payload: string,
  secret: string,
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Support both plain hex and prefixed formats
    const cleanSignature = signature.replace(/^sha256=/, '');

    const receivedBuffer = new Uint8Array(Buffer.from(cleanSignature, 'hex'));
    const expectedBuffer = new Uint8Array(
      Buffer.from(expectedSignature, 'hex'),
    );

    if (receivedBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    debug && console.error('Error validating HMAC signature:', error);
    return false;
  }
}

/**
 * Validate Stripe-style timestamp + signature format
 */
function validateStripeStyleSignature(
  signature: string,
  payload: string,
  secret: string,
): boolean {
  try {
    const elements = signature.split(',');
    let timestamp = '';
    let v1Signature = '';

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') timestamp = value;
      else if (key === 'v1') v1Signature = value;
    }

    if (!timestamp || !v1Signature) return false;

    // Check timestamp is within 5 minutes (300 seconds)
    const timestampNumber = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - timestampNumber) > 300) {
      debug && console.log('Stripe-style signature timestamp too old');
      return false;
    }

    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    const receivedBuffer = new Uint8Array(Buffer.from(v1Signature, 'hex'));
    const expectedBuffer = new Uint8Array(
      Buffer.from(expectedSignature, 'hex'),
    );

    if (receivedBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    debug && console.error('Error validating Stripe-style signature:', error);
    return false;
  }
}

/**
 * Get webhook authentication info for status endpoints
 */
export function getWebhookAuthInfo() {
  return {
    webhook_secret_configured: !!CROWDSPLIT_WEBHOOK_SECRET,
    authentication_methods: [
      'payload_secret (current)',
      'hmac_sha256 (future-ready)',
      'stripe_style (future-ready)',
    ],
    supported_signature_headers: [
      'x-crowdsplit-signature',
      'x-signature',
      'signature',
      'stripe-signature',
    ],
    security_features: {
      constant_time_comparison: true,
      timing_attack_protection: true,
      timestamp_validation: 'stripe_style only (5 minute window)',
    },
  };
}
