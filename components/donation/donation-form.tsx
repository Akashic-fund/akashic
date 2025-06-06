/**
 * DonationForm - Main container for donation form
 * Responsible for: Orchestrating sub-components, providing shared state and handlers
 * Component size: Under 150 lines following maintainability rules
 */

'use client';

import { Button, Card, CardContent, Badge, Checkbox } from '@/components/ui';
import { ErrorAlert } from '@/components/error-alert';
import { Campaign } from '@/types/campaign';
import { PaymentMethodSelector } from './payment-method-selector';
import { AmountInput } from './amount-input';
import { DonationToggle } from './donation-toggle';
import { DonationSummary } from './donation-summary';
import { useDonationForm } from '@/hooks/use-donation-form';
import { useAuth } from '@/contexts';
import { Users } from 'lucide-react';
import Image from 'next/image';

// Loading skeleton component
function DonationFormSkeleton() {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="animate-pulse space-y-4">
        <div className="h-6 w-1/2 rounded bg-gray-200"></div>
        <div className="h-10 rounded bg-gray-200"></div>
        <div className="h-20 rounded bg-gray-200"></div>
        <div className="h-10 rounded bg-gray-200"></div>
        <div className="h-16 rounded bg-gray-200"></div>
      </CardContent>
    </Card>
  );
}

// Authentication prompt component
function AuthenticationPrompt() {
  const { login } = useAuth();
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">
          Connect wallet to donate
        </h3>
        <p className="mb-6 max-w-md text-gray-500">
          Please connect your wallet to make a donation. This helps us track
          your contribution and provide you with a receipt.
        </p>
        <Button
          variant="outline"
          className="bg-purple-50 font-semibold text-purple-600 hover:bg-purple-100"
          onClick={login}
        >
          Connect Wallet
          <Image src="/wallet-icon.png" alt="wallet" width={14} height={14} />
        </Button>
      </CardContent>
    </Card>
  );
}

interface DonationFormProps {
  campaign: Campaign;
}

export default function DonationForm({ campaign }: DonationFormProps) {
  const { authenticated, isReady } = useAuth();

  // Show authentication prompt if not authenticated and ready to check
  if (isReady && !authenticated) {
    return <AuthenticationPrompt />;
  }

  // Show loading skeleton while auth is loading
  if (!isReady) {
    return <DonationFormSkeleton />;
  }

  return <AuthenticatedDonationForm campaign={campaign} />;
}

// Separate component for authenticated users
function AuthenticatedDonationForm({ campaign }: DonationFormProps) {
  const {
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

    // Validation & calculations
    amountValidation,
    calculations,
    formatters,

    // Derived state
    canProceed,
    showDonationDetails,
    showDonateButton,

    // Errors
    donateError,
    stripeError,

    // Event handlers
    handleAmountChange,
    handlePaymentMethodChange,
    handleDonateClick,
    handleAnonymousChange,
    showStripeForm,
    isProcessing,
  } = useDonationForm(campaign);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-6">
        {/* Error alerts */}
        <ErrorAlert error={donateError} />
        <ErrorAlert error={stripeError} />

        {/* Payment method selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">How do you want to donate?</h2>

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            isCorrectNetwork={isCorrectNetwork}
            stripeData={stripeData}
            stripePromise={stripePromise}
            campaign={campaign}
            userAddress={userAddress}
            amount={amount}
            fallbackComponent={DonationFormSkeleton}
            showStripeForm={showStripeForm}
          />
        </div>

        {/* Matching badge */}
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-teal-50 text-teal-600 hover:bg-teal-50"
          >
            <span className="mr-1">🎯</span> Eligible for matching
          </Badge>
        </div>

        {/* Amount selection */}
        {showDonationDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Choose your donation amount</h3>

            <AmountInput
              amount={amount}
              onAmountChange={handleAmountChange}
              paymentMethod={paymentMethod}
              selectedToken={selectedToken}
              onTokenChange={setSelectedToken}
              validation={amountValidation}
              availableBalance={calculations.availableBalance.toString()}
              formatUSD={formatters.formatUSD}
              numericAmount={calculations.numericAmount}
            />

            <DonationToggle
              isDonatingToPlatform={isDonatingToPlatform}
              onToggleChange={setIsDonatingToPlatform}
              percentage={percentage}
              onPercentageChange={setPercentage}
            />

            <DonationSummary
              campaignTitle={campaign.title}
              poolAmount={calculations.poolAmount}
              platformAmount={calculations.platformAmount}
              totalAmount={calculations.numericAmount}
              isDonatingToPlatform={isDonatingToPlatform}
              percentage={percentage}
              formatCrypto={formatters.formatCrypto}
            />
          </div>
        )}

        {/* Anonymous donation option */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) =>
                handleAnonymousChange(checked === true)
              }
            />
            <label htmlFor="anonymous" className="text-sm font-medium">
              Make my donation anonymous
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Your profile information won&apos;t be shown publicly for this
            donation.
          </p>
        </div>

        {/* Donate button */}
        {showDonateButton && (
          <Button
            className="w-full"
            size="lg"
            disabled={!canProceed}
            onClick={handleDonateClick}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>
                  {paymentMethod === 'card'
                    ? 'Setting up payment...'
                    : 'Processing...'}
                </span>
              </div>
            ) : calculations.numericAmount > 0 ? (
              `Donate ${formatters.formatUSD(calculations.numericAmount)} with ${paymentMethod === 'wallet' ? 'Wallet' : 'Card'}`
            ) : (
              `Donate with ${paymentMethod === 'wallet' ? 'Wallet' : 'Card'}`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
