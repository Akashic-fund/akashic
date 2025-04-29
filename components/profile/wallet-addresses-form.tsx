"use client"

import { useState, useEffect } from "react"
import { useWallets } from '@privy-io/react-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const walletAddressSchema = z.object({
    walletAddress: z.string()
        .min(42, "Ethereum address must be 42 characters")
        .max(42, "Ethereum address must be 42 characters")
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
})

type WalletAddressFormValues = z.infer<typeof walletAddressSchema>

interface WalletAddressesFormProps {
    customerId: string
    onSuccess: () => void
}

export function WalletAddressesForm({ customerId, onSuccess }: WalletAddressesFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentWalletAddress, setCurrentWalletAddress] = useState<string | null>(null)
    const [recipientWallet, setRecipientWallet] = useState<string | null>(null)
    const { wallets } = useWallets()
    const wallet = wallets[0]

    const form = useForm<WalletAddressFormValues>({
        resolver: zodResolver(walletAddressSchema),
        defaultValues: {
            walletAddress: "",
        }
    })

    // Set current wallet address and fetch recipient wallet if any
    useEffect(() => {
        const initWalletInfo = async () => {
            if (wallet) {
                const address = await wallet.address
                setCurrentWalletAddress(address)
                
                // Fetch user data to get recipient wallet
                try {
                    const response = await fetch(`/api/users/me?userAddress=${address}`)
                    if (response.ok) {
                        const userData = await response.json()
                        if (userData.recipientWallet) {
                            setRecipientWallet(userData.recipientWallet)
                            form.setValue("walletAddress", userData.recipientWallet)
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error)
                }
            }
        }
        
        initWalletInfo()
    }, [wallet, form])

    const onSubmit = async (data: WalletAddressFormValues) => {
        if (!customerId) {
            toast({
                title: "Error",
                description: "Customer ID is required. Please complete your personal information first.",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSubmitting(true)
            const userAddress = wallet ? await wallet.address : null

            if (!userAddress) {
                throw new Error("No wallet connected")
            }

            const response = await fetch('/api/bridge/wallet-addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    userAddress,
                    walletAddress: data.walletAddress,
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Failed to add wallet address')
            }

            setRecipientWallet(data.walletAddress)
            
            toast({
                title: "Success",
                description: "Your recipient wallet address has been saved.",
            })
            
            onSuccess()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred while saving your wallet address",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment Recipient Address</CardTitle>
                <CardDescription>
                    Set the wallet address where you want to receive payments.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Connected Wallet</AlertTitle>
                    <AlertDescription>
                        Your currently connected wallet address is:
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm mt-2 block break-all">
                            {currentWalletAddress || "Not connected"}
                        </code>
                        {recipientWallet && (
                            <>
                                <div className="mt-2">Your current recipient wallet is:</div>
                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm mt-1 block break-all">
                                    {recipientWallet}
                                </code>
                            </>
                        )}
                    </AlertDescription>
                </Alert>

                <div>
                    <h3 className="text-lg font-medium mb-4">Set Recipient Wallet Address</h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="walletAddress"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ethereum Wallet Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0x..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter an Ethereum wallet address where you would like to receive funds. Leave empty to use your connected wallet.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Save Recipient Address"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
} 