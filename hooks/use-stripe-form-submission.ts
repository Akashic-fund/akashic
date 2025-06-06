import { useState, useCallback } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from '@/hooks/use-toast';
import { type Campaign } from '@/types/campaign';
import { useStripeIsReady } from '@/hooks/use-stripe-ready';

const debug = process.env.NODE_ENV !== 'production';

interface UseStripeFormSubmissionProps {
  publicKey: string;
  campaign: Campaign;
}

/**
 * Custom hook for handling Stripe payment form submission
 * Encapsulates all payment processing logic and state management
 */
export function useStripeFormSubmission({
  publicKey,
  campaign,
}: UseStripeFormSubmissionProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const isReady = useStripeIsReady();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!stripe || !elements || !isReady) {
        return;
      }

      // Prevent multiple form submissions
      if (isProcessing) {
        return;
      }

      setIsProcessing(true);

      try {
        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
          setError(submitError.message || 'An error occurred');
          setIsProcessing(false);
          return;
        }

        const returnUrl = new URL(
          `${window.location.origin}/campaigns/${campaign.slug}/donation/success`,
        );
        returnUrl.searchParams.append('stripe_key', publicKey);

        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: returnUrl.toString(),
          },
        });
        const { error } = result;

        // Debug: log the full Stripe result
        debug && console.log('Stripe confirmPayment result:', result);

        if (error) {
          // Prefer the most specific error message from Stripe
          let displayMessage = error.message || 'An error occurred';
          if (
            error.payment_intent &&
            error.payment_intent.last_payment_error &&
            error.payment_intent.last_payment_error.message
          ) {
            displayMessage = error.payment_intent.last_payment_error.message;
          }
          setError(displayMessage);
          console.error('Stripe confirmPayment error:', error);
          toast({
            title: 'Error',
            description: displayMessage,
            variant: 'destructive',
          });
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.error('Payment confirmation error:', err);
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, isReady, isProcessing, publicKey, campaign.slug, toast],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isProcessing,
    isReady,
    handleSubmit,
    clearError,
  };
}
