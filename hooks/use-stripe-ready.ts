import { useMemo } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

const debug = process.env.NODE_ENV !== 'production';

/**
 * Hook to check if Stripe Elements are ready for use
 * Combines stripe and elements readiness into a single boolean
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
