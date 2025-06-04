'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  SelectValue,
  Badge,
  Switch,
  Input,
  Checkbox,
} from '@/components/ui';
import { ErrorAlert } from '@/components/error-alert';
import { Wallet, HelpCircle, CreditCard } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentStripeForm } from '@/components/payment/stripe-form';
import { PaymentSwitchWalletNetwork } from '@/components/payment/switch-wallet-network';
import { useStripePaymentCallback } from '@/hooks/use-stripe';
import { useNetworkCheck } from '@/hooks/use-network';
import { useDonationCallback } from '@/hooks/use-donation';
import { useUsdcBalance } from '@/lib/web3/hooks/use-usdc-balance';
import { useAuth } from '@/contexts';

interface DonationFormProps {
  campaign: Campaign;
}

export default function DonationForm({ campaign }: DonationFormProps) {
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(10);
  const [isDonatingToAkashic, setIsDonatingToAkashic] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('card');
  const usdcBalance = useUsdcBalance();
  const { address: userAddress } = useAuth();
  // Simulated values - in a real app these would come from an API or wallet
  const tokenPrice = 1; // USD per USDC
  const availableBalance = usdcBalance; // Update available balance to use fetched USDC balance

  const numericAmount = parseFloat(amount) || 0;
  const akashicAmount = isDonatingToAkashic
    ? (numericAmount * percentage) / 100
    : 0;
  const poolAmount = numericAmount - akashicAmount;

  const formatCrypto = (value: number) =>
    `${value.toFixed(6)} ${selectedToken}`;
  const formatUSD = (value: number) => `$ ${(value * tokenPrice).toFixed(2)}`;

  const { isCorrectNetwork } = useNetworkCheck();
  const {
    onDonate,
    isProcessing: isDonateProcessing,
    error: donateError,
  } = useDonationCallback({
    campaign,
    amount,
    selectedToken,
  });
  const {
    onStripePayment,
    error: stripeError,
    isProcessing: isStripeProcessing,
    stripeData,
    stripePromise,
  } = useStripePaymentCallback({
    amount,
  });
  const isProcessing = isStripeProcessing || isDonateProcessing;
  // const handleStripeConfirmation = async () => {
  //   if (!stripeData) return;

  //   try {
  //     const stripe = await loadStripe(stripeData.publicKey);
  //     if (!stripe) throw new Error('Failed to load Stripe');

  //     const { error } = await stripe.confirmPayment({
  //       elements: stripe.elements({
  //         clientSecret: stripeData.clientSecret,
  //         appearance: {
  //           theme: 'stripe'
  //         }
  //       }),
  //       confirmParams: {
  //         return_url: `${window.location.origin}/payment/success`,
  //       }
  //     });

  //     if (error) throw error;

  //     toast({
  //       title: "Success!",
  //       description: "Your card payment has been processed",
  //     });

  //   } catch (err) {
  //     console.error('Stripe confirmation error:', err);
  //     setError(err instanceof Error ? err.message : "Failed to confirm card payment");
  //   }
  // };

  // useEffect(() => {
  //   if (stripeData) {
  //     handleStripeConfirmation();
  //   }
  // }, [stripeData]);

  const showDonationDetails = paymentMethod === 'wallet' || !stripeData;
  const showDonateButton = paymentMethod === 'wallet' || !stripeData;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4">
        <ErrorAlert error={donateError} />
        <ErrorAlert error={stripeError} />

        <div className="space-y-2">
          <h2 className="text-lg font-medium">How do you want to donate?</h2>
        </div>

        <Tabs
          defaultValue="card"
          onValueChange={(value) => {
            setPaymentMethod(value as 'wallet' | 'card');
            setSelectedToken(value === 'wallet' ? 'USDC' : 'USD');
          }}
        >
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

          <TabsContent value="wallet">
            <div className="flex items-center justify-between">
              {!isCorrectNetwork && (
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">
                    Save on gas fees, switch network.
                  </span>
                </div>
              )}
              <PaymentSwitchWalletNetwork />
            </div>
          </TabsContent>

          <TabsContent value="card">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Secure payment via Stripe</span>
            </div>
            {stripeData && stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: stripeData.clientSecret,
                  appearance: { theme: 'stripe' },
                }}
              >
                <PaymentStripeForm
                  publicKey={stripeData.publicKey}
                  campaign={campaign}
                  userAddress={userAddress}
                  amount={amount}
                />
              </Elements>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-teal-50 text-teal-600 hover:bg-teal-50"
          >
            <span className="mr-1">👋</span> Eligible for matching
          </Badge>
        </div>

        <div className="space-y-4">
          {(!stripeData || paymentMethod === 'wallet') && (
            <div className="relative">
              <div className="flex rounded-md border shadow-sm">
                <div className="relative flex flex-1">
                  <Select
                    value={paymentMethod === 'wallet' ? selectedToken : 'USD'}
                    onValueChange={setSelectedToken}
                    disabled={paymentMethod === 'card'}
                  >
                    <SelectTrigger className="w-[120px] rounded-r-none border-0 bg-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethod === 'wallet' ? (
                        <SelectItem value="USDC">USDC</SelectItem>
                      ) : (
                        <SelectItem value="USD">USD</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="rounded-l-none border-0 border-l"
                  />
                </div>
                {paymentMethod === 'wallet' && (
                  <div className="flex items-center px-3 text-sm text-muted-foreground">
                    {formatUSD(numericAmount)}
                  </div>
                )}
              </div>
              {paymentMethod === 'wallet' && (
                <div className="mt-1 text-sm text-muted-foreground">
                  Available: {availableBalance}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="ml-1 inline h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your available balance in {selectedToken}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )}

          {showDonationDetails && (
            <>
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Switch
                    checked={isDonatingToAkashic}
                    onCheckedChange={setIsDonatingToAkashic}
                  />
                  <span className="text-sm">Donate to Akashic</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose a percentage to donate to Akashic</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {isDonatingToAkashic && (
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((value) => (
                      <Button
                        key={value}
                        variant={percentage === value ? 'default' : 'outline'}
                        onClick={() => setPercentage(value)}
                        className="flex-1"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div className="flex justify-between text-sm">
                  <span>Donating to {campaign.title}</span>
                  <span className="font-medium">
                    {formatCrypto(poolAmount)}
                  </span>
                </div>
                {isDonatingToAkashic && (
                  <div className="flex justify-between text-sm">
                    <span>Donating {percentage}% to Akashic</span>
                    <span className="font-medium">
                      {formatCrypto(akashicAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold">
                  <span>Your total donation</span>
                  <span>{formatCrypto(numericAmount)}</span>
                </div>
              </div>
            </>
          )}

          {showDonateButton && (
            <Button
              className="w-full"
              size="lg"
              disabled={!numericAmount || isProcessing}
              onClick={paymentMethod === 'wallet' ? onDonate : onStripePayment}
            >
              {isProcessing
                ? 'Processing...'
                : `Donate with ${paymentMethod === 'wallet' ? 'Wallet' : 'Card'}`}
            </Button>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox id="anonymous" />
              <label htmlFor="anonymous" className="text-sm font-medium">
                Make my donation anonymous
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              By checking this, we won&apos;t consider your profile information
              as a donor for this donation and won&apos;t show it on public
              pages.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
