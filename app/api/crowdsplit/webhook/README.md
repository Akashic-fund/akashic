# CrowdSplit Webhook Implementation

## Overview

This document provides complete implementation details for handling CrowdSplit webhooks in the Akashic platform. CrowdSplit uses a unique authentication method and payload structure that differs from standard webhook implementations.

**⚠️ IMPORTANT**: CrowdSplit only supports **ONE** webhook URL per environment. Team coordination is essential during development – reportedly multiple are on the roadmap but not live (June 3 2025).

## Unified Webhook Architecture

Our implementation uses a **single unified webhook endpoint** that handles all CrowdSplit event types:

- **Endpoint**: `/api/crowdsplit/webhook`
- **Event Routing**: Internal routing based on event type
- **Supported Events**: 
  - `transaction.updated` → Payment processing
  - `kyc.status_updated` → KYC status updates

This follows the same pattern as Stripe webhooks where one URL handles multiple event types.

## Authentication Method

CrowdSplit uses **payload-based secret validation** instead of header-based signatures. Our implementation supports multiple authentication methods:

### Primary Method (Current)
- **Secret Location**: Inside the webhook payload as `secret` field
- **Validation**: Compare `payload.secret` with `CROWDSPLIT_WEBHOOK_SECRET` environment variable
- **No Header Signatures**: CrowdSplit does not send signature headers like `x-signature` or `stripe-signature`

### Enhanced Security (Future-Ready)
Our implementation also supports:
- **HMAC SHA256** signature verification
- **Stripe-style** timestamp signature validation
- **Constant-time comparison** for all authentication methods

### Environment Configuration

```bash
# .env.local
CROWDSPLIT_WEBHOOK_SECRET="EFJBQPYXCA"
```

## Local Development Setup with ngrok

### Prerequisites

1. **ngrok Account**: Register a free account at [ngrok.com](https://ngrok.com)
2. **ngrok Installation** (macOS):
   ```bash
   # Using Homebrew (recommended)
   brew install ngrok
   
   # Or download directly from ngrok.com
   ```
3. **ngrok Authentication**:
   ```bash
   # Get your authtoken from ngrok dashboard
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

### Setting Up Local Webhook Testing

#### Step 1: Start Your Local Development Server

```bash
# Start your Next.js app
docker-compose up
# or
pnpm dev
```

#### Step 2: Expose Local Server with ngrok

```bash
# Expose port 3000 (or your dev server port)
ngrok http 3000

# You'll see output like:
# Forwarding https://abc123.ngrok-free.app -> http://localhost:3000
```

#### Step 3: Register Webhook URL with CrowdSplit

**⚠️ CRITICAL**: Only ONE developer can have an active webhook at a time!

1. **Check with Team First**: Communicate in your team chat before registering
2. **Use Postman or curl** to register your webhook (requires a valid access token): 

```bash
# Register webhook endpoint
curl -X POST https://api.crowdsplit.com/v1/merchant/webhooks/enable \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-ngrok-url.ngrok-free.app/api/crowdsplit/webhook"
  }'
```

#### Step 4: Update Environment Variables

CrowdSplit will return a new webhook secret every time you register an URL. Update your `.env.local`:

```bash
CROWDSPLIT_WEBHOOK_SECRET="NEW_SECRET_FROM_RESPONSE"
```

### Team Coordination Guidelines

#### Before Starting Webhook Development

1. **Announce in Team Chat**: "Starting webhook testing - registering my ngrok URL"
2. **Check Current Status**: Ask if anyone else is currently testing webhooks
3. **Get Permission**: Wait for confirmation before proceeding

## Webhook Payload Structure

### Payment Completion Webhook

```json
{
  "secret": "EFJBQPYXCA",
  "data": {
    "type": "transaction.updated",
    "id": "7eaffcc8-084b-4e08-95e9-5c74f6c4033d",
    "status": "COMPLETED",
    "subStatus": "CAPTURED",
    "metadata": null
  }
}
```

### KYC Status Update Webhook

```json
{
  "secret": "EFJBQPYXCA",
  "event": "kyc.status_updated",
  "data": {
    "customer_id": "cust_12345",
    "status": "completed"
  }
}
```

### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `secret` | string | Authentication secret (must match environment variable) |
| `data.type` | string | Event type for payment events (e.g., `"transaction.updated"`) |
| `event` | string | Event type for KYC events (e.g., `"kyc.status_updated"`) |
| `data.id` | string | Unique transaction/payment ID (payment events) |
| `data.customer_id` | string | Customer ID (KYC events) |
| `data.status` | string | Transaction or KYC status |
| `data.subStatus` | string | Sub-status for additional detail (payment events) |
| `data.metadata` | object\|null | Additional transaction metadata |

## Event Detection Logic

### Payment Confirmation Events

A webhook should trigger payment confirmation when **ALL** of the following conditions are met:

```typescript
const isPaymentEvent = (
  (data.type === 'transaction.updated' || eventType === 'transaction.updated') &&
  data.status === 'COMPLETED' &&
  data.subStatus === 'CAPTURED'
);
```

### KYC Completion Events

A webhook should trigger KYC completion when:

```typescript
const isKycEvent = (
  (data.event === 'kyc.status_updated' || eventType === 'kyc.status_updated') &&
  data.status === 'completed'
);
```

### Supported Event Types

Our unified webhook handler processes:

| Event Type | Description | Handler Function |
|------------|-------------|------------------|
| `transaction.updated` | Payment transaction updates (Stripe & Bridge.xyz) | `handlePaymentEvent()` |
| `kyc.status_updated` | KYC verification status changes | `handleKycEvent()` |

Future event types may include:
- `transaction.created`
- `transaction.failed` 
- `transaction.refunded`

## Security Considerations

### Secret Validation
- **Always validate** the `secret` field before processing any webhook
- **Use constant-time comparison** to prevent timing attacks:

```typescript
import crypto from 'crypto';

function validateSecret(received: string, expected: string): boolean {
  if (!received || !expected) return false;
  
  const receivedBuffer = Buffer.from(received, 'utf8');
  const expectedBuffer = Buffer.from(expected, 'utf8');
  
  if (receivedBuffer.length !== expectedBuffer.length) return false;
  
  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}
```

### Request Validation
- Validate that the request has a proper JSON content-type
- Ensure the payload structure matches expected format
- Log all webhook attempts for monitoring

## Database Integration

### Payment Status Mapping

| CrowdSplit Status | CrowdSplit SubStatus | Akashic Status |
|-------------------|---------------------|----------------|
| `COMPLETED` | `CAPTURED` | `confirmed` |
| `COMPLETED` | (any other) | `confirmed` |
| `PENDING` | `PROCESSING` | `pending` |
| `FAILED` | (any) | `failed` |
| `CANCELLED`/`CANCELED` | (any) | `canceled` |
| (any other) | (any) | `pending` |

### KYC Status Mapping

| CrowdSplit Status | Akashic Action |
|-------------------|----------------|
| `completed` | Set `user.isKycCompleted = true` |
| (any other) | No database update |

### Payment Lookup Strategy

1. **Primary**: Match by `externalId` field with provider filtering
2. **Provider Support**: Both `CROWDSPLIT` and `STRIPE` (legacy support)

```typescript
const payment = await db.payment.findFirst({
  where: {
    externalId: transactionId,
    provider: { in: ['CROWDSPLIT', 'STRIPE'] }, // Legacy support
  },
});
```

### KYC Lookup Strategy

```typescript
const updatedUsers = await db.user.updateMany({
  where: { crowdsplitCustomerId: customerId },
  data: { isKycCompleted: true },
});
```

### Local Testing Workflow

1. **Start Development Environment**:
   ```bash
   docker-compose up
   ```

2. **Start ngrok** (new terminal):
   ```bash
   ngrok http 3000
   ```

3. **Copy ngrok URL** from terminal output

4. **Coordinate with Team** before registering webhook

5. **Register Webhook** using Postman/curl

6. **Update Environment Variables** with new secret

7. **Test with Real Transaction** or use debug endpoint to trigger webhook events

8. **Monitor Logs** for webhook events - look for `[WEBHOOK]`, `[PAYMENT]`, and `[KYC]` prefixes

### Monitoring ngrok Traffic

Access the ngrok web interface at `http://127.0.0.1:4040/inspect/http` to see all incoming requests in real-time.

## Error Handling

### Webhook Response Structure

Our unified webhook returns detailed responses:

```json
{
  "success": true,
  "received": true,
  "event_type": "transaction.updated",
  "authentication_method": "payload_secret",
  "payment_found": true,
  "payment_id": 123,
  "transaction_id": "7eaffcc8-084b-4e08-95e9-5c74f6c4033d",
  "old_status": "pending",
  "new_status": "confirmed",
  "message": "Payment status updated successfully"
}
```

### Common Issues

1. **Secret Mismatch**
   - Verify `CROWDSPLIT_WEBHOOK_SECRET` environment variable
   - Check for extra whitespace or encoding issues
   - Ensure you updated the secret after webhook registration

2. **Payment Not Found**
   - Ensure `externalId` is properly set when creating payments
   - Check for timing issues (webhook arrives before payment creation)
   - Review recent payments in debug logs

3. **Invalid Payload Structure**
   - Validate JSON parsing
   - Check for missing required fields (`secret`, event type, transaction ID)

4. **ngrok Connection Issues**
   - Verify ngrok is running and accessible
   - Check firewall settings
   - Ensure correct port forwarding

### Response Codes

| Status | Meaning | Action |
|--------|---------|---------|
| 200 | Success | Webhook processed successfully |
| 400 | Bad Request | Invalid parameters (missing secret, malformed JSON, etc.) |
| 404 | Not Found | Payment record not found |
| 500 | Server Error | Internal processing error |
