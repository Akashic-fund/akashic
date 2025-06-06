import { Suspense } from 'react';
import { type Campaign } from '@/types/campaign';
import { type Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentStripeForm } from '@/components/payment/stripe-form';
import { StripeFormSkeleton } from '@/components/payment/stripe-form-skeleton';
import { PaymentErrorBoundary } from '@/components/payment/payment-error-boundary';

interface LazyStripeFormProps {
  stripePromise: Promise<Stripe | null>;
  clientSecret: string;
  publicKey: string;
  campaign: Campaign;
  userAddress: string | null;
  amount: string;
}

/**
 * Lazy-loaded Stripe form wrapper with error boundary and loading states
 * Coordinates Stripe Elements initialization and form rendering
 */
export function LazyStripeForm({
  stripePromise,
  clientSecret,
  publicKey,
  campaign,
  userAddress,
  amount,
}: LazyStripeFormProps) {
  const handleRetry = () => {
    // Force re-render by re-creating the component
    window.location.reload();
  };

  return (
    <PaymentErrorBoundary onRetry={handleRetry}>
      <Suspense fallback={<StripeFormSkeleton />}>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '8px',
              },
            },
          }}
        >
          <PaymentStripeForm
            publicKey={publicKey}
            campaign={campaign}
            userAddress={userAddress}
            amount={amount}
          />
        </Elements>
      </Suspense>
    </PaymentErrorBoundary>
  );
}
