'use client'

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Badge } from "./ui/badge"
import { Switch } from "./ui/switch"
import { Input } from "./ui/input"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import { Info, Wallet, HelpCircle, CreditCard } from 'lucide-react'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import { Campaign } from "@/types/campaign"
import { ethers } from 'ethers'
import { useWallets } from '@privy-io/react-auth'
import { useToast } from "@/hooks/use-toast"
import { erc20Abi } from 'viem'
import { USDC_ADDRESS } from "@/lib/constant"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import type { Stripe, StripePaymentElementOptions, StripePaymentElementChangeEvent } from '@stripe/stripe-js'

interface DonationFormProps {
  campaign: Campaign;
}

// Add platform config (hardcoded for example)
const platformConfig = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
}

function StripePaymentForm({ publicKey, campaign }: { publicKey: string; campaign: Campaign }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true)
    }
  }, [stripe, elements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !isReady) {
      return
    }

    // Prevent multiple form submissions
    if (isProcessing) {
      return
    }

    setIsProcessing(true)

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'An error occurred')
        return
      }

      const returnUrl = new URL(`${window.location.origin}/campaigns/${campaign.slug}/donation/success`)
      returnUrl.searchParams.append('stripe_key', publicKey)

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
        },
      })

      if (error) {
        setError(error.message || 'An error occurred')
        toast({
          title: "Error",
          description: error.message || "Payment failed",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error('Payment confirmation error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isReady) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading payment form...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div id="payment-element">
        <PaymentElement 
          options={{ 
            layout: 'accordion',
            defaultValues: {
              billingDetails: {
                name: 'John Doe', // test user name
                email: 'user@example.com', // test user email
              }
            }
          } as StripePaymentElementOptions} 
          onChange={(event: StripePaymentElementChangeEvent) => {
            if (event.complete) {
              setError(null)
            } else if (event.empty) {
              setError('Please enter payment details')
            }
          }}
        />
      </div>
      {error && (
        <div id="error-message" className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      <Button
        id="submit"
        type="submit"
        disabled={!stripe || isProcessing || !isReady}
        className="w-full mt-4"
      >
        {isProcessing ? "Processing..." : "Pay now"}
      </Button>
    </form>
  )
}

export default function DonationForm({ campaign }: DonationFormProps) {
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [amount, setAmount] = useState('')
  const [percentage, setPercentage] = useState(10)
  const [isDonatingToAkashic, setIsDonatingToAkashic] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usdcBalance, setUsdcBalance] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null)
  const [stripeData, setStripeData] = useState<{
    clientSecret: string;
    publicKey: string;
  } | null>(null)

  // Simulated values - in a real app these would come from an API or wallet
  const tokenPrice = 1 // USD per USDC
  const availableBalance = usdcBalance // Update available balance to use fetched USDC balance

  
  const numericAmount = parseFloat(amount) || 0
  const akashicAmount = isDonatingToAkashic ? (numericAmount * percentage) / 100 : 0
  const poolAmount = numericAmount - akashicAmount

  const formatCrypto = (value: number) => `${value.toFixed(6)} ${selectedToken}`
  const formatUSD = (value: number) => `$ ${(value * tokenPrice).toFixed(2)}`

  const { wallets } = useWallets()
  const { toast } = useToast()
  const wallet = wallets[0] // Assuming first wallet

  // Fetch USDC balance when the wallet is connected
  useEffect(() => {
    const fetchUsdcBalance = async () => {
      if (wallet && await wallet.isConnected()) {
        const privyProvider = await wallet.getEthereumProvider()
        const walletProvider = new ethers.providers.Web3Provider(privyProvider)
        const signer = walletProvider.getSigner()
        const userAddress = await signer.getAddress()

        // Initialize USDC contract
        const usdcContract = new ethers.Contract(USDC_ADDRESS as string, erc20Abi, signer)
        
        // Fetch balance
        const balance = await usdcContract.balanceOf(userAddress)
        setUsdcBalance(parseFloat(ethers.utils.formatUnits(balance, process.env.NEXT_PUBLIC_PLEDGE_TOKEN_DECIMALS)))
      }
    }

    fetchUsdcBalance()
  }, [wallet]) // Run effect when wallet changes

  const handleDonate = async () => {
    try {
      if (!wallet || !wallet.isConnected()) {
        throw new Error('Wallet not connected')
      }

      const privyProvider = await wallet.getEthereumProvider()
      const walletProvider = new ethers.providers.Web3Provider(privyProvider)
      const signer = walletProvider.getSigner()
      const userAddress = await signer.getAddress()

      // Switch to Alfajores network first
      try {
        await privyProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaef3' }], // 44787 in hex
        })
      } catch (switchError: unknown) {
        if (switchError instanceof Error && 'code' in switchError && switchError.code === 4902) {
          try {
            await privyProvider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaef3',
                chainName: 'Celo Alfajores Testnet',
                nativeCurrency: {
                  name: 'CELO',
                  symbol: 'CELO',
                  decimals: 18
                },
                rpcUrls: [platformConfig.rpcUrl],
                blockExplorerUrls: ['https://alfajores.celoscan.io/']
              }],
            })
          } catch (addError) {
            console.error('Error adding network:', addError)
            throw new Error('Failed to add network')
          }
        }
        throw switchError
      }

      // Initialize contracts
      
      const usdcContract = new ethers.Contract(USDC_ADDRESS as string, erc20Abi, signer)
      const amountInUSDC = ethers.utils.parseUnits(amount || '0', process.env.NEXT_PUBLIC_PLEDGE_TOKEN_DECIMALS)

      // First approve the treasury to spend USDC
      const approveTx = await usdcContract.approve(campaign.treasuryAddress, amountInUSDC)
      await approveTx.wait()

      // Make the pledge transaction
      const treasuryABI = ["function pledgeWithoutAReward(address backer, uint256 pledgeAmount) external returns (bool)"]
      const treasuryContract = new ethers.Contract(campaign.treasuryAddress!, treasuryABI, signer)
      
      const tx = await treasuryContract.pledgeWithoutAReward(
        userAddress,
        amountInUSDC,
        {
          gasLimit: (await treasuryContract.estimateGas.pledgeWithoutAReward(userAddress, amountInUSDC))
            .mul(120).div(100)
        }
      )

      // Only create payment record after transaction is sent
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,
          token: selectedToken,
          campaignId: campaign.id,
          isAnonymous: false,
          status: 'confirming',
          userAddress,
          transactionHash: tx.hash,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment record')
      }

      const { paymentId } = await paymentResponse.json()
      const receipt = await tx.wait()

      // Update payment status based on receipt
      await fetch('/api/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          status: receipt.status === 1 ? 'confirmed' : 'failed',
        }),
      })

      toast({
        title: "Success!",
        description: "Your donation has been processed",
      })

    } catch (err) {
      console.error('Donation error:', err)
      const errorMessage = err instanceof Error 
        ? err.message
        : typeof err === 'object' && err && 'message' in err
          ? String(err.message)
          : "Failed to process donation"
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleStripePayment = async () => {
    try {
      setIsProcessing(true)
      setError(null)
      console.log("process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_ID", process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_ID)
      console.log("process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_SECRET", process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_SECRET)
      
      // Get access token
      const tokenResponse = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_ID,
          client_secret: process.env.NEXT_PUBLIC_CROWDSPLIT_CLIENT_SECRET,
          grant_type: "client_credentials"
        })
      });
      console.log("tokenResponse", tokenResponse)
      
      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        throw new Error(error.message || 'Failed to get access token');
      }
      const { access_token } = await tokenResponse.json();

      // Create customer
      const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_CROWDSPLIT_API_URL}/api/v1/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({ email: 'user@example.com' }) // TODO: Get user email
      });

      if (!customerResponse.ok) {
        const error = await customerResponse.json();
        throw new Error(error.message || 'Failed to create customer');
      }
      const { data: { id: customerId } } = await customerResponse.json();

      // Initialize payment
      const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_CROWDSPLIT_API_URL}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Convert to cents
          customer_id: customerId,
          currency: "USD",
          payment_method: "CARD",
          provider: "STRIPE"
        })
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        throw new Error(error.message || 'Failed to initialize payment');
      }
      const { data: { id: transactionId } } = await paymentResponse.json();

      // Confirm payment
      const confirmResponse = await fetch(`${process.env.NEXT_PUBLIC_CROWDSPLIT_API_URL}/api/v1/payments/${transactionId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      });

      if (!confirmResponse.ok) {
        const error = await confirmResponse.json();
        throw new Error(error.message || 'Failed to confirm payment');
      }
      const { data: { metadata } } = await confirmResponse.json();
      
      // Initialize Stripe with the public key from Crowdsplit
      setStripePromise(loadStripe(metadata.public_key))
      setStripeData({
        clientSecret: metadata.client_secret,
        publicKey: metadata.public_key
      });

    } catch (err) {
      console.error('Card payment error:', err);
      setError(err instanceof Error ? err.message : "Failed to process card payment");
    } finally {
      setIsProcessing(false);
    }
  };

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

  const showDonationDetails = paymentMethod === 'wallet' || !stripeData

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="default" className="border-indigo-100 bg-indigo-50">
            <Info className="h-4 w-4 text-indigo-600" />
            <AlertDescription className="text-indigo-600">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h2 className="text-lg font-medium">How do you want to donate?</h2>
        </div>

        <Tabs defaultValue="wallet" onValueChange={(value) => setPaymentMethod(value as 'wallet' | 'card')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Crypto Wallet
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Credit Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm">Save on gas fees, switch network.</span>
              </div>
              <Button variant="link" className="text-pink-500">
                Switch Network
              </Button>
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
                  appearance: { theme: 'stripe' }
                }}
              >
                <StripePaymentForm publicKey={stripeData.publicKey} campaign={campaign} />
              </Elements>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-teal-50 text-teal-600 hover:bg-teal-50">
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
                  <span className="font-medium">{formatCrypto(poolAmount)}</span>
                </div>
                {isDonatingToAkashic && (
                  <div className="flex justify-between text-sm">
                    <span>Donating {percentage}% to Akashic</span>
                    <span className="font-medium">{formatCrypto(akashicAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold">
                  <span>Your total donation</span>
                  <span>{formatCrypto(numericAmount)}</span>
                </div>
              </div>
            </>
          )}

          {!stripeData && (
            <Button 
              className="w-full" 
              size="lg" 
              disabled={!numericAmount || isProcessing}
              onClick={paymentMethod === 'wallet' ? handleDonate : handleStripePayment}
            >
              {isProcessing ? 'Processing...' : `Donate with ${paymentMethod === 'wallet' ? 'Wallet' : 'Card'}`}
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
              By checking this, we won&apos;t consider your profile information as a donor for this donation and won&apos;t show it on public pages.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

