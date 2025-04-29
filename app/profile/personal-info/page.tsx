"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"


export default function PersonalInfoPage() {
    const { user, ready, authenticated } = usePrivy()
    const [hasCustomer, setHasCustomer] = useState(false)
    const [customerId, setCustomerId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch customer data on component mount
    useEffect(() => {
        const fetchCustomerData = async () => {
            if (!ready || !authenticated || !user?.wallet?.address) return;

            try {
                // Check if user has a Bridge customer account
                const response = await fetch(`/api/bridge/customer?userAddress=${user.wallet.address}`)
                const data = await response.json()

                if (data.hasCustomer) {
                    setHasCustomer(true)
                    setCustomerId(data.customerId)
                }
            } catch (error) {
                console.error('Error fetching customer data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCustomerData()
    }, [ready, authenticated, user])

    if (!ready || isLoading) {
        return (
            <div className="container flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                    <p className="text-muted-foreground">Please wait while we fetch your profile information.</p>
                </div>
            </div>
        )
    }

    if (!authenticated) {
        return (
            <div className="container flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                    <p className="text-muted-foreground">Please connect your wallet to access your profile information.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl py-8 md:py-12 px-3 md:px-6 mx-auto">
            <div className="mb-6">
                <Link href="/profile">
                    <Button variant="outline" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profile
                    </Button>
                </Link>
            </div>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personal Information</h1>
                    <p className="text-base text-muted-foreground mt-2">
                        Complete your personal information to enable payments and KYC verification.
                    </p>
                </div>

                <PersonalInfoForm
                    hasCustomer={hasCustomer}
                    customerId={customerId}
                    onSuccess={(id) => {
                        setHasCustomer(true)
                        setCustomerId(id)
                    }}
                />
            </div>
        </div>
    )
} 