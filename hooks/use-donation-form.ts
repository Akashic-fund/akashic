/**
 * Custom hook for donation form state management and business logic
 * Handles: Form state, validation, calculations, payment flow coordination
 */

import { useState, useCallback, useMemo } from 'react';
import { Campaign } from '@/types/campaign';
import { useStripeLazy } from '@/hooks/use-stripe-lazy';
import { useNetworkCheck } from '@/hooks/use-network';
import { useDonationCallback } from '@/hooks/use-donation';
import { useUsdcBalance } from '@/lib/web3/hooks/use-usdc-balance';
import { useAuth } from '@/contexts';
import { useDebouncedValidation } from '@/hooks/use-debounced-value';
import { DEFAULT_USER_EMAIL } from '@/lib/constant';

// Validation function for donation amounts
const validateDonationAmount = (amount: string): string | null => {
  const numAmount = parseFloat(amount);

  if (!amount) {
    return null; // Allow empty amounts (not an error state)
  }

  if (isNaN(numAmount)) {
    return 'Please enter a valid number';
  }

  if (numAmount <= 0) {
    return 'Amount must be greater than $0';
  }

  if (numAmount < 1) {
    return 'Minimum donation is $1';
  }

  if (numAmount > 10000) {
    return 'Maximum donation is $10,000';
  }

  return null;
};

export function useDonationForm(campaign: Campaign) {
  // Form state
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [isDonatingToPlatform, setIsDonatingToPlatform] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('card');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // External hooks
  const usdcBalance = useUsdcBalance();
  const { address: userAddress } = useAuth();
  const { isCorrectNetwork } = useNetworkCheck();

  // Validation
  const amountValidation = useDebouncedValidation(
    amount,
    validateDonationAmount,
    300,
  );

  // Payment hooks
  const {
    onDonate,
    isProcessing: isDonateProcessing,
    error: donateError,
  } = useDonationCallback({
    campaign,
    amount,
    selectedToken,
    isAnonymous,
  });

  // Lazy Stripe implementation - no API calls until donate button clicked
  const {
    error: stripeError,
    isProcessing: isStripeProcessing,
    stripeData,
    stripePromise,
    createPaymentIntent,
    reset: resetStripe,
    isReady: isStripeReady,
  } = useStripeLazy({
    amount,
    campaign,
    userEmail: DEFAULT_USER_EMAIL, // TODO: Get actual user email from session or profile
    isAnonymous,
  });

  // Memoized calculations
  const calculations = useMemo(() => {
    const numericAmount = parseFloat(amount) || 0;
    const platformAmount = isDonatingToPlatform
      ? (numericAmount * percentage) / 100
      : 0;
    const poolAmount = numericAmount - platformAmount;
    const tokenPrice = 1; // USD per USDC

    return {
      numericAmount,
      platformAmount,
      poolAmount,
      tokenPrice,
      availableBalance: usdcBalance,
    };
  }, [amount, isDonatingToPlatform, percentage, usdcBalance]);

  // Memoized formatting functions
  const formatters = useMemo(
    () => ({
      formatCrypto: (value: number) => {
        // USDC is dollar-pegged, so format like USD with 2 decimals
        if (selectedToken === 'USDC' || selectedToken === 'USD') {
          return `$${value.toFixed(2)}`;
        }
        // For other crypto tokens, use 6 decimals
        return `${value.toFixed(6)} ${selectedToken}`;
      },
      formatUSD: (value: number) =>
        `$${(value * calculations.tokenPrice).toFixed(2)}`,
    }),
    [selectedToken, calculations.tokenPrice],
  );

  // Derived state
  const isProcessing = isStripeProcessing || isDonateProcessing;
  const hasErrors = !!donateError || !!amountValidation.error;

  // For card payments, allow retry even if there's a stripe error (could be temporary)
  // For wallet payments, block if any errors exist
  const canProceed =
    calculations.numericAmount > 0 &&
    !isProcessing &&
    (paymentMethod === 'card' ? !hasErrors : !hasErrors && !stripeError);

  // Show Stripe form when payment intent is ready
  const showStripeForm = paymentMethod === 'card' && isStripeReady;
  const showDonationDetails = paymentMethod === 'wallet' || !showStripeForm;
  const showDonateButton = paymentMethod === 'wallet' || !showStripeForm;

  // Event handlers
  const handleAmountChange = useCallback(
    (newAmount: string) => {
      setAmount(newAmount);
      // Reset Stripe state when amount changes
      if (stripeData) {
        resetStripe();
      }
    },
    [stripeData, resetStripe],
  );

  const handlePaymentMethodChange = useCallback(
    (value: string) => {
      setPaymentMethod(value as 'wallet' | 'card');
      setSelectedToken(value === 'wallet' ? 'USDC' : 'USD');
      // Reset Stripe state when switching payment methods
      resetStripe();
    },
    [resetStripe],
  );

  const handleDonateClick = useCallback(async () => {
    if (paymentMethod === 'wallet') {
      onDonate();
    } else {
      // For card payments, create payment intent first
      try {
        await createPaymentIntent();
      } catch (error) {
        // Error is already set in the stripe hook
        console.error('Failed to create payment intent:', error);
      }
    }
  }, [paymentMethod, onDonate, createPaymentIntent]);

  const handleAnonymousChange = useCallback((checked: boolean) => {
    setIsAnonymous(checked);
  }, []);

  return {
    // State
    selectedToken,
    setSelectedToken,
    amount,
    percentage,
    setPercentage,
    isDonatingToPlatform,
    setIsDonatingToPlatform,
    paymentMethod,
    isAnonymous,

    // External data
    userAddress,
    isCorrectNetwork,
    stripeData,
    stripePromise,

    // Validation
    amountValidation,

    // Calculations
    calculations,
    formatters,

    // Derived state
    isProcessing,
    hasErrors,
    canProceed,
    showDonationDetails,
    showDonateButton,
    showStripeForm,

    // Errors
    donateError,
    stripeError,

    // Event handlers
    handleAmountChange,
    handlePaymentMethodChange,
    handleDonateClick,
    handleAnonymousChange,
  };
}
