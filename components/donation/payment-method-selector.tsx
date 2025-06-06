/**
 * PaymentMethodSelector - Handles payment method selection (card vs wallet)
 * Responsible for: Payment method tabs, network warnings, and Stripe form rendering
 */

import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { CreditCard, Wallet, AlertCircle } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { LazyStripeForm } from '@/components/payment/stripe-form-lazy';
import { PaymentSwitchWalletNetwork } from '@/components/payment/switch-wallet-network';
import { type Stripe } from '@stripe/stripe-js';

interface PaymentMethodSelectorProps {
  paymentMethod: 'wallet' | 'card';
  onPaymentMethodChange: (method: string) => void;
  isCorrectNetwork: boolean;
  stripeData: {
    clientSecret: string;
    publicKey: string;
    paymentIntentId: string;
  } | null;
  stripePromise: Promise<Stripe | null> | null;
  campaign: Campaign;
  userAddress: string | null;
  amount: string;
  fallbackComponent: React.ComponentType;
  showStripeForm?: boolean;
}

export function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  isCorrectNetwork,
  stripeData,
  stripePromise,
  campaign,
  userAddress,
  amount,
  fallbackComponent: FallbackComponent,
  showStripeForm = false,
}: PaymentMethodSelectorProps) {
  return (
    <Tabs value={paymentMethod} onValueChange={onPaymentMethodChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Credit Card
        </TabsTrigger>
        <TabsTrigger value="wallet" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Crypto Wallet
        </TabsTrigger>
      </TabsList>

      <TabsContent value="wallet" className="space-y-4">
        <div className="flex items-center justify-between">
          {!isCorrectNetwork && (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                Switch network to save on gas fees
              </span>
            </div>
          )}
          <PaymentSwitchWalletNetwork />
        </div>
      </TabsContent>

      <TabsContent value="card" className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm">Secure payment via Stripe</span>
        </div>

        {/* Only show Stripe form when payment intent is ready */}
        {showStripeForm && stripeData && stripePromise && (
          <Suspense fallback={<FallbackComponent />}>
            <LazyStripeForm
              stripePromise={stripePromise}
              clientSecret={stripeData.clientSecret}
              publicKey={stripeData.publicKey}
              campaign={campaign}
              userAddress={userAddress}
              amount={amount}
            />
          </Suspense>
        )}
      </TabsContent>
    </Tabs>
  );
}
