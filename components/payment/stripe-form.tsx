import { type Campaign } from '@/types/campaign';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui';
import type {
  StripePaymentElementOptions,
  StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { useStripeFormSubmission } from '@/hooks/use-stripe-form-submission';
import { DEFAULT_USER_EMAIL } from '@/lib/constant';

const debug = process.env.NODE_ENV !== 'production';

interface PaymentStripeFormProps {
  publicKey: string;
  campaign: Campaign;
  userAddress: string | null;
  amount: string;
}

/**
 * Main Stripe payment form component
 * Handles user interaction with Stripe Elements and form rendering
 */
export function PaymentStripeForm({
  publicKey,
  campaign,
  userAddress,
  amount,
}: PaymentStripeFormProps) {
  const { error, isProcessing, isReady, handleSubmit, clearError } =
    useStripeFormSubmission({
      publicKey,
      campaign,
    });

  debug &&
    console.log('Stripe form props:', {
      publicKey,
      campaign,
      userAddress,
      amount,
    });

  if (!isReady) {
    return (
      <div className="py-4 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        <p className="mt-2 text-sm text-gray-600">Loading payment form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div id="payment-element">
        <PaymentElement
          options={
            {
              layout: 'accordion',
              defaultValues: {
                billingDetails: {
                  name: 'John Doe', // test user name
                  email: DEFAULT_USER_EMAIL, // test user email
                },
              },
            } as StripePaymentElementOptions
          }
          onChange={(event: StripePaymentElementChangeEvent) => {
            if (event.complete) {
              clearError();
            } else if (event.empty) {
              // Don't set error for empty state - let user fill form naturally
            }
          }}
        />
      </div>
      {error && (
        <div id="error-message" className="mt-2 text-sm text-red-500">
          {error}
        </div>
      )}
      <Button
        id="submit"
        type="submit"
        disabled={isProcessing || !isReady}
        className="mt-4 w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  );
}
