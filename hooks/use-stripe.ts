import { useMemo, useState, useCallback } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { type Stripe } from '@stripe/stripe-js';

import { enableApiMock } from '@/lib/develop';
import { mockStripeInstance } from '@/lib/test/mock-stripe';

const debug = process.env.NODE_ENV !== 'production';

/**
 * KNOWN ISSUE: Credit card payments via Stripe are currently not being saved to the database.
 *
 * Problem: The current Stripe Elements payment flow with auto-redirects doesn't allow us to save payment records
 * to our database, as the redirect happens before any code can execute and we don't know if the payment succeeded.
 *
 *  RECOMMENDED: Implement Stripe webhooks
 *    - Docs: https://docs.stripe.com/elements/express-checkout-element/migration#post-payment
 *    - Create a webhook endpoint at /api/webhooks/stripe
 *    - Configure it in the Stripe dashboard
 *    - Use it to handle payment_intent.succeeded events
 *    - Save payment records server-side when the webhook is triggered
 */

export function useStripeIsReady() {
  const stripe = useStripe();
  const elements = useElements();
  const isReady = useMemo(() => {
    const ready = stripe && elements ? true : false;
    debug && console.log('[Stripe] Elements ready:', ready);
    return ready;
  }, [stripe, elements]);

  return isReady;
}

export function useStripePaymentCallback({ amount }: { amount: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [stripeData, setStripeData] = useState<{
    clientSecret: string;
    publicKey: string;
  } | null>(null);
  const onStripePayment = useCallback(async () => {
    try {
      debug && console.log('[Stripe] Starting payment process');
      setIsProcessing(true);
      setError(null);

      // Validate amount
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError('Please enter a valid donation amount.');
        setIsProcessing(false);
        return;
      }

      // Create customer
      debug && console.log('[Stripe] Creating customer');
      const customerResponse = await fetch(
        `/api/crowdsplit/donation-customer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'user@example.com' }), // TODO: Get user email
        },
      );
      if (!customerResponse.ok) {
        const error = await customerResponse.json();
        debug && console.error('[Stripe] Customer creation failed:', error);
        throw new Error(error.message || 'Failed to create customer');
      }
      const { customerId } = await customerResponse.json();
      debug && console.log('[Stripe] Customer created with ID:', customerId);

      // Initialize payment
      debug && console.log('[Stripe] Initializing payment for amount:', amount);
      const paymentResponse = await fetch(`/api/crowdsplit/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Convert to cents
          customerId: customerId,
          currency: 'USD',
          paymentMethod: 'CARD',
          provider: 'STRIPE',
        }),
      });

      if (!paymentResponse.ok) {
        let errorMsg = 'Failed to initialize payment';
        try {
          const error = await paymentResponse.json();
          debug &&
            console.error('[Stripe] Payment initialization failed:', error);
          errorMsg = error.msg || error.message || errorMsg;
        } catch (e) {
          debug &&
            console.error(
              '[Stripe] Payment initialization failed, could not parse error:',
              e,
            );
        }
        throw new Error(errorMsg);
      }
      const { id: transactionId } = await paymentResponse.json();
      debug &&
        console.log(
          '[Stripe] Payment initialized with transaction ID:',
          transactionId,
        );

      // Confirm payment
      debug && console.log('[Stripe] Confirming payment');
      const confirmResponse = await fetch(
        `/api/crowdsplit/payments/${transactionId}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!confirmResponse.ok) {
        let errorMsg = 'Failed to confirm payment';
        try {
          const error = await confirmResponse.json();
          debug &&
            console.error('[Stripe] Payment confirmation failed:', error);
          errorMsg = error.msg || error.message || errorMsg;
        } catch (e) {
          debug &&
            console.error(
              '[Stripe] Payment confirmation failed, could not parse error:',
              e,
            );
        }
        throw new Error(errorMsg);
      }
      const { clientSecret, publicKey } = await confirmResponse.json();
      debug && console.log('[Stripe] Payment confirmed successfully');

      // Initialize Stripe with the public key from Crowdsplit
      debug && console.log('[Stripe] Setting up Stripe instance');
      setStripeData({ clientSecret, publicKey });
      if (enableApiMock) {
        debug && console.log('[Stripe] Using mock Stripe instance');
        setStripePromise(
          new Promise((resolve) =>
            setTimeout(() => resolve(mockStripeInstance), 1000),
          ),
        );
      } else {
        debug && console.log('[Stripe] Loading live Stripe instance');
        setStripePromise(loadStripe(publicKey));
      }
    } catch (err) {
      debug && console.error('[Stripe] Payment process error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to process card payment',
      );
    } finally {
      setIsProcessing(false);
      debug && console.log('[Stripe] Payment process completed');
    }
  }, [amount]);
  return { onStripePayment, isProcessing, error, stripeData, stripePromise };
}
