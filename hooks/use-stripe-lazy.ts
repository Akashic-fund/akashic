/**
 * Lazy Stripe Payment Hook - Performance Optimized
 * Only makes API calls when user actually clicks "Donate" button
 * Fixes the performance issue where API calls were happening on form load
 */

import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { type Stripe } from '@stripe/stripe-js';
import { Campaign } from '@/types/campaign';
import { enableApiMock } from '@/lib/develop';
import { mockStripeInstance } from '@/lib/test/mock-stripe';
import { DEFAULT_USER_EMAIL } from '@/lib/constant';

const debug = process.env.NODE_ENV !== 'production';

interface UseStripeLazyProps {
  amount: string;
  campaign: Campaign;
  userEmail?: string;
  isAnonymous?: boolean;
}

export function useStripeLazy({
  amount,
  campaign,
  userEmail = DEFAULT_USER_EMAIL,
  isAnonymous = false,
}: UseStripeLazyProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [stripeData, setStripeData] = useState<{
    clientSecret: string;
    publicKey: string;
    paymentIntentId: string;
  } | null>(null);

  const createPaymentIntent = useCallback(async () => {
    try {
      debug && console.log('[Stripe Lazy] Starting payment intent creation');
      setIsProcessing(true);
      setError(null);

      // Validate amount
      const numericAmount = parseFloat(amount);
      if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid donation amount.');
      }

      // Step 1: Get or create customer (optimized to check for existing first)
      debug &&
        console.log(
          '[Stripe Lazy] Getting or creating customer for:',
          userEmail,
        );
      const customerResponse = await fetch(
        '/api/crowdsplit/donation-customer',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        },
      );

      if (!customerResponse.ok) {
        let errorMessage = 'Failed to get or create customer';
        try {
          const errorData = await customerResponse.json();
          // Extract the most specific error message available
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }

          // Add HTTP status for better debugging
          if (customerResponse.status === 401) {
            errorMessage = `Authentication required: ${errorMessage}`;
          } else if (customerResponse.status === 403) {
            errorMessage = `Permission denied: ${errorMessage}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, use status text
          errorMessage = `Failed to get or create customer (${customerResponse.status}: ${customerResponse.statusText})`;
        }

        debug &&
          console.error('[Stripe Lazy] Customer operation failed:', {
            status: customerResponse.status,
            statusText: customerResponse.statusText,
            error: errorMessage,
          });

        throw new Error(errorMessage);
      }

      const { customerId, isExisting } = await customerResponse.json();
      debug &&
        console.log('[Stripe Lazy] Customer operation result:', {
          customerId,
          isExisting,
          operation: isExisting
            ? 'Retrieved existing customer'
            : 'Created new customer',
          userEmail,
        });

      // Step 2: Create payment intent
      debug &&
        console.log(
          '[Stripe Lazy] Creating payment intent for amount:',
          numericAmount,
        );
      const paymentResponse = await fetch('/api/crowdsplit/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(numericAmount * 100), // Convert to cents
          customerId,
          currency: 'USD',
          paymentMethod: 'CARD',
          provider: 'STRIPE',
          campaignId: campaign.id,
          isAnonymous: isAnonymous,
        }),
      });

      if (!paymentResponse.ok) {
        let errorMessage = 'Failed to create payment intent';
        try {
          const errorData = await paymentResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.msg || errorData.message) {
            errorMessage = errorData.msg || errorData.message;
          }

          if (paymentResponse.status === 401) {
            errorMessage = `Authentication required: ${errorMessage}`;
          } else if (paymentResponse.status === 403) {
            errorMessage = `Permission denied: ${errorMessage}`;
          }
        } catch (parseError) {
          errorMessage = `Failed to create payment intent (${paymentResponse.status}: ${paymentResponse.statusText})`;
        }

        debug &&
          console.error('[Stripe Lazy] Payment creation failed:', {
            status: paymentResponse.status,
            statusText: paymentResponse.statusText,
            error: errorMessage,
          });

        throw new Error(errorMessage);
      }

      const { id: paymentIntentId } = await paymentResponse.json();
      debug &&
        console.log('[Stripe Lazy] Payment intent created:', paymentIntentId);

      // Step 3: Confirm payment intent to get Stripe credentials
      debug && console.log('[Stripe Lazy] Confirming payment intent');
      const confirmResponse = await fetch(
        `/api/crowdsplit/payments/${paymentIntentId}/confirm`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (!confirmResponse.ok) {
        let errorMessage = 'Failed to confirm payment intent';
        try {
          const errorData = await confirmResponse.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.msg || errorData.message) {
            errorMessage = errorData.msg || errorData.message;
          }

          if (confirmResponse.status === 401) {
            errorMessage = `Authentication required: ${errorMessage}`;
          } else if (confirmResponse.status === 403) {
            errorMessage = `Permission denied: ${errorMessage}`;
          }
        } catch (parseError) {
          errorMessage = `Failed to confirm payment intent (${confirmResponse.status}: ${confirmResponse.statusText})`;
        }

        debug &&
          console.error('[Stripe Lazy] Payment confirmation failed:', {
            status: confirmResponse.status,
            statusText: confirmResponse.statusText,
            error: errorMessage,
          });

        throw new Error(errorMessage);
      }

      const { clientSecret, publicKey } = await confirmResponse.json();
      debug &&
        console.log('[Stripe Lazy] Payment intent confirmed successfully');

      // Step 4: Initialize Stripe Elements
      debug && console.log('[Stripe Lazy] Setting up Stripe Elements');
      const stripeCredentials = { clientSecret, publicKey, paymentIntentId };
      setStripeData(stripeCredentials);

      if (enableApiMock) {
        debug && console.log('[Stripe Lazy] Using mock Stripe instance');
        setStripePromise(Promise.resolve(mockStripeInstance));
      } else {
        debug && console.log('[Stripe Lazy] Loading live Stripe instance');
        setStripePromise(loadStripe(publicKey));
      }

      return stripeCredentials;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create payment intent';
      debug && console.error('[Stripe Lazy] Error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [amount, userEmail, campaign.id, isAnonymous]);

  const reset = useCallback(() => {
    setError(null);
    setStripeData(null);
    setStripePromise(null);
    setIsProcessing(false);
  }, []);

  return {
    // State
    error,
    isProcessing,
    stripeData,
    stripePromise,

    // Actions
    createPaymentIntent,
    reset,

    // Computed
    isReady: !!stripeData && !!stripePromise,
  };
}
