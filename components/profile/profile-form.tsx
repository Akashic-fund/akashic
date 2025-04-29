"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "./personal-info-form"
import { KycVerificationForm } from "./kyc-verification-form" 
import { PaymentMethodsForm } from "./payment-methods-form"
import { WalletAddressesForm } from "./wallet-addresses-form"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAccount } from "wagmi"
import { PaymentMethod } from "@prisma/client"

export default function ProfileForm() {
    const [activeTab, setActiveTab] = useState("personal-info")
    const [isLoading, setIsLoading] = useState(true)
    const [hasCustomer, setHasCustomer] = useState(false)
    const [customerId, setCustomerId] = useState<string | null>(null)
    const [isKycCompleted, setIsKycCompleted] = useState(false)
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
    const { address, isConnected } = useAccount()

    // Fetch customer data on component mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (!address || !isConnected) {
                setIsLoading(false)
                return
            }

            try {
                const userAddress = address

                // Check if user has a Bridge customer account
                const response = await fetch(`/api/bridge/customer?userAddress=${userAddress}`)
                const data = await response.json()

                if (data.hasCustomer) {
                    setHasCustomer(true)
                    setCustomerId(data.customerId)

                    // TODO: Get KYC status
                    // This could be a separate endpoint or part of the customer data
                    setIsKycCompleted(data.kycCompleted || false)

                    // If KYC is completed, fetch payment methods
                    if (data.kycCompleted) {
                        const methodsResponse = await fetch(`/api/bridge/payment-methods?userAddress=${userAddress}`)
                        const methodsData = await methodsResponse.json()
                        setPaymentMethods(methodsData.paymentMethods || [])
                    }
                }
            } catch (error) {
                console.error("Error fetching customer data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load profile data. Please try again later.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchCustomerData()
    }, [address, isConnected])

    // const handleUpdateProfile = async (data: any) => {
    //     // Logic to update profile
    // }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading your profile data...</p>
                </div>
            </div>
        )
    }

    if (!address || !isConnected) {
        return (
            <Alert variant="destructive" className="my-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Not connected</AlertTitle>
                <AlertDescription>
                    Please connect your wallet to access your profile.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <Tabs defaultValue="personal-info" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                <TabsTrigger value="kyc-verification" disabled={!hasCustomer}>KYC Verification</TabsTrigger>
                <TabsTrigger value="payment-methods" disabled={!hasCustomer || !isKycCompleted}>Payment Methods</TabsTrigger>
                <TabsTrigger value="wallet-addresses" disabled={!hasCustomer}>Wallet Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
                <PersonalInfoForm
                    hasCustomer={hasCustomer}
                    customerId={customerId}
                    onSuccess={(id) => {
                        setHasCustomer(true)
                        setCustomerId(id)
                        setActiveTab("kyc-verification")
                        toast({
                            title: "Success",
                            description: "Your personal information has been saved.",
                        })
                    }}
                />
            </TabsContent>

            <TabsContent value="kyc-verification">
                <KycVerificationForm
                    customerId={customerId || ""}
                    isCompleted={isKycCompleted}
                    onSuccess={() => {
                        setIsKycCompleted(true)
                        setActiveTab("payment-methods")
                        toast({
                            title: "Success",
                            description: "Your KYC verification has been completed.",
                        })
                    }}
                />
            </TabsContent>

            <TabsContent value="payment-methods">
                <PaymentMethodsForm
                    customerId={customerId || ""}
                    paymentMethods={paymentMethods}
                    onSuccess={(methods: PaymentMethod[]) => {
                        setPaymentMethods(methods)
                        toast({
                            title: "Success",
                            description: "Your payment method has been added.",
                        })
                    }}
                />
            </TabsContent>

            <TabsContent value="wallet-addresses">
                <WalletAddressesForm
                    customerId={customerId || ""}
                    onSuccess={() => {
                        toast({
                            title: "Success",
                            description: "Your wallet address has been saved.",
                        })
                    }}
                />
            </TabsContent>
        </Tabs>
    )
} 