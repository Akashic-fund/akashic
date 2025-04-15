"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAccount, useConnectorClient } from "wagmi"
import { type Address, type Chain, type Client, type Transport } from "viem"
import { ethers, providers, Signer } from "ethers"
import { AlloABI } from "@/contracts/abi/qf/Allo"
import { prepareRegistrationData, RecipientRegistrationParams } from "@/lib/actions/rounds/recipient"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ALLO_ADDRESS } from "@/lib/constant"

// Helper function to convert wagmi client to ethers v5 signer
function clientToSigner(client: Client<Transport, Chain>): Signer | undefined {
    const { account, chain, transport } = client
    if (!chain) {
        console.error("Chain information is missing from the client.")
        return undefined
    }
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    // Use Web3Provider for ethers v5
    const provider = new providers.Web3Provider(transport, network)
    console.log("account address:", account?.address)
    const signer = provider.getSigner(account?.address) // Get signer by address
    return signer
}

interface RegisterCampaignRecipientProps {
    campaignId: number
    campaignTitle: string
    campaignWalletAddress: Address
    poolId: bigint
    roundId: number
    disabled?: boolean
    buttonVariant?: "default" | "outline" | "secondary"
    buttonText?: string
    showDialog?: boolean
    onComplete?: () => void
}

export function RegisterCampaignRecipient({
    campaignId,
    campaignTitle,
    campaignWalletAddress,
    poolId,
    roundId,
    disabled = false,
    buttonVariant = "default",
    buttonText = "Register Campaign as Recipient",
    showDialog = true,
    onComplete,
}: RegisterCampaignRecipientProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { address: accountAddress, isConnected } = useAccount()
    const { data: client } = useConnectorClient()

    // Memoize the signer
    const signer = useMemo(() => {
        if (!client || !client.chain) return undefined
        return clientToSigner(client)
    }, [client])

    async function isRecipientRegistered(
        poolId: bigint,
        recipientAddress: string
    ): Promise<boolean> {
        try {
            // Create a read-only contract interface (doesn't need signer)
            const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_CELO_ALFAJORES_RPC_URL);
            const alloContract = new ethers.Contract(ALLO_ADDRESS, AlloABI, provider);

            // Create encoded recipient ID - this varies by strategy, but often it's just the address
            // This is a common pattern in Allo's QF strategies
            const recipientId = recipientAddress;

            // Check the recipient status using the Allo contract's view function
            const status = await alloContract.getRecipientStatus(poolId, recipientId);
            console.log("recipient status:", status, "poolId:", poolId, "recipientId:", recipientId)

            // Status 1 = Accepted, 2 = Rejected, 3 = Pending, 0 = None
            // Any value other than 0 means they've been registered before
            return status > 0;
        } catch (error) {
            console.error("Error checking recipient status:", error);
            return false; // Assume not registered if check fails
        }
    }

    console.log("roundId:", roundId, "router:", router, "isRecipientRegistered:", isRecipientRegistered)

    // function logTransactionData(tx: ethers.providers.TransactionRequest) {
    //     console.log("=== TRANSACTION DATA DETAILS ===");
    //     console.log("To:", tx.to);
    //     console.log("From:", tx.from);
    //     console.log("Value:", tx.value?.toString());
    //     console.log("Gas Limit:", tx.gasLimit?.toString());
    //     console.log("Data:", tx.data);

    //     // Try to decode the function signature
    //     const functionSig = tx?.data ? ethers.utils.hexlify(tx.data).substring(0, 10) : '0x00000000'; // Fallback value
    //     console.log("Function Signature:", functionSig);

    //     // Log pool ID (first parameter)
    //     try {
    //         const poolIdHex = tx?.data ? ethers.utils.hexlify(tx.data).substring(10, 74) : '0x00000000'; // First parameter is 32 bytes after function sig
    //         if (poolIdHex) {
    //             const poolId = parseInt(poolIdHex, 16);
    //             console.log("Decoded Pool ID:", poolId);
    //         }
    //     } catch (e) {
    //         console.log("Could not decode pool ID", e);
    //     }
    // }

    async function handleRegisterRecipient() {
        if (!isConnected || !accountAddress) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to register.",
                variant: "destructive",
            })
            return
        }

        if (!signer) {
            toast({
                title: "Signer not available",
                description: "Could not get signer from connected wallet. Please reconnect.",
                variant: "destructive",
            })
            return
        }

        if (!campaignWalletAddress) {
            toast({
                title: "Campaign wallet address required",
                description: "Please set a wallet address for your campaign first.",
                variant: "destructive",
            })
            return
        }

        setIsRegistering(true)
        let txHash: string | undefined = undefined
        let pendingRecordCreated = false

        try {
            // // --- Step 1: Initial Database Registration (PENDING status) ---
            // console.log("Attempting initial database registration...")
            // const initialRegisterResponse = await fetch("/api/rounds/recipients/register", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({
            //         campaignId,
            //         roundId,
            //         recipientAddress: campaignWalletAddress,
            //         walletAddress: accountAddress, // Submitter's address
            //         // No txHash or onchainRecipientId yet
            //     }),
            // })

            // const initialRegisterData = await initialRegisterResponse.json()

            // if (!initialRegisterResponse.ok || !initialRegisterData.success) {
            //     // Handle specific case where it might already be pending or approved
            //     if (initialRegisterData.message?.includes("already exists")) {
            //         toast({
            //             title: "Registration Pending or Complete",
            //             description: initialRegisterData.message || "This campaign is already registered or pending approval for this round.",
            //             variant: "default"
            //         })
            //         // Check on-chain status just in case DB is out of sync
            //         const alreadyRegisteredOnChain = await isRecipientRegistered(poolId, campaignWalletAddress);
            //         if (alreadyRegisteredOnChain) {
            //             console.log("Confirmed already registered on-chain.")
            //             // Optionally trigger a DB update here if needed, or just refresh
            //             if (onComplete) onComplete()
            //             else router.refresh()
            //             if (showDialog) setIsOpen(false)
            //         } else {
            //             // It exists in DB but not on-chain? Could be pending or failed previously.
            //             // For now, just stop the process. More sophisticated retry logic could be added.
            //             console.warn("Recipient exists in DB but not confirmed on-chain.")
            //         }
            //     } else {
            //         toast({
            //             title: "Database Registration Failed",
            //             description: initialRegisterData.error || "Could not save initial registration request.",
            //             variant: "destructive",
            //         })
            //     }
            //     setIsRegistering(false) // Stop the process if initial DB save fails
            //     return
            // }

            pendingRecordCreated = true
            console.log("Initial database registration (PENDING).")
            toast({
                title: "Registration Initiated",
                description: "Submitting transaction to the blockchain...",
            })

            // --- Step 2: Blockchain Transaction ---
            console.log("Preparing registration data for blockchain...")

            const alloContract = new ethers.Contract(ALLO_ADDRESS, AlloABI, signer)

            const registrationParams = {
                useProfileAnchor: false,
                recipientAddresses: [campaignWalletAddress],
                recipientAddress: campaignWalletAddress,
                metadata: {
                    protocol: 1,
                    pointer: `ipfs://campaign/${campaignId}`,
                },
                proposalBid: 100, // Ensure this is sufficient
                poolId: Number(poolId),
            }

            const { recipientAddresses, outerData } = prepareRegistrationData(registrationParams as RecipientRegistrationParams)

            console.log("Registration data prepared:", {
                poolId: poolId.toString(),
                recipientAddresses,
                outerData,
                alloContract
            })

            // Estimate gas to detect potential failures early
            // let gasEstimate
            // try {
            //     gasEstimate = await alloContract.estimateGas.registerRecipient(
            //         poolId,
            //         recipientAddresses,
            //         outerData
            //     )
            //     // Add 20% buffer
            //     const gasLimit = gasEstimate.mul(120).div(100)
            //     console.log("Gas estimate with 20% buffer:", gasLimit.toString())
            // } catch (gasError) {
            //     console.error("Gas estimation failed:", gasError)
            //     throw new Error("Gas estimation failed, transaction likely to fail. Check arguments and permissions.")
            // }

            console.log("Preparing to send transaction...")

            // make transaction
            const tx = await alloContract.registerRecipient(
                poolId,
                recipientAddresses,
                outerData,
                { gasLimit: 500000 }
                // { gasLimit: gasEstimate ? gasEstimate.mul(120).div(100) : 500000 }
            )

            console.log("tx alloContract", tx)
            const response = await signer.sendTransaction(tx)
            txHash = response.hash
            console.log(`Transaction sent for alloContract.registerRecipient: ${txHash}. Waiting for confirmation...`)

            txHash = tx.hash 
            console.log(`Transaction sent with hash: ${txHash}. Waiting for confirmation...`)

            toast({
                title: "Registration submitted",
                description: "Waiting for transaction confirmation...",
            })

            console.log("Waiting for transaction receipt...")
            const receipt = await tx.wait()
            console.log("Transaction Receipt:", receipt)

            // --- Step 3: Update Database with Confirmation ---
            // if (receipt && receipt.status === 1) {
            //     console.log("Transaction successful on-chain.")
            //     const onchainRecipientId = campaignWalletAddress

            //     console.log("Attempting to update database record to APPROVED...")
            //     const confirmResponse = await fetch("/api/rounds/recipients/register", {
            //         method: "POST", // Or PUT if your API is designed that way
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             campaignId,
            //             roundId,
            //             recipientAddress: campaignWalletAddress, // Include for lookup
            //             walletAddress: accountAddress, // Include for consistency or potential checks
            //             txHash: txHash,
            //             onchainRecipientId: onchainRecipientId,
            //         }),
            //     })

            //     const confirmData = await confirmResponse.json()

            //     if (confirmResponse.ok && confirmData.success) {
            //         toast({
            //             title: "Registration Successful",
            //             description: "Your campaign has been registered as a recipient.",
            //         })
            //         if (onComplete) onComplete()
            //         else router.refresh()
            //         if (showDialog) setIsOpen(false)
            //     } else {
            //         // Blockchain succeeded, but DB update failed!
            //         console.error("Database update failed after successful transaction:", confirmData.error)
            //         toast({
            //             title: "Registration Partially Complete",
            //             description: `On-chain registration succeeded (Tx: ${txHash?.substring(0,10)}...), but failed to update database status. Please contact support.`,
            //             variant: "destructive", // Use warning variant
            //             duration: 10000, // Show longer
            //         })
            //          // Still refresh or call onComplete as the primary action succeeded
            //         if (onComplete) onComplete()
            //         else router.refresh()
            //         if (showDialog) setIsOpen(false)
            //     }
            // } else {
            //     console.error("Transaction failed on-chain. Receipt:", receipt)
            //     // NOTE: The DB record remains PENDING. We could add another API call here
            //     // to mark it as FAILED, but for now, we just notify the user.
            //     toast({
            //         title: "Transaction Failed On-Chain",
            //         description: `Transaction reverted${txHash ? ` (Hash: ${txHash})` : ''}. Your registration is still pending. You might need to retry.`,
            //         variant: "destructive",
            //     })
            //     // Do not close dialog or refresh automatically on failure
            // }
        } catch (error: unknown) {
            console.error("Registration process failed:", error)
            let errorMessage = "An unexpected error occurred during registration."

            if (error && typeof error === 'object') {
                // Handle ethers specific errors
                if ('code' in error) {
                    const typedError = error as { code: string | number, reason?: string, message?: string };

                    if (typedError.code === 'UNPREDICTABLE_GAS_LIMIT') {
                        errorMessage = "Cannot estimate gas; transaction likely to fail. Possible reasons: Insufficient permissions, pool inactive, recipient already registered, insufficient proposal bid, or incorrect arguments."
                        if (typedError.reason) console.error("Potential Revert Reason:", typedError.reason)
                    } else if (typedError.code === "ACTION_REJECTED" || typedError.code === 4001) {
                        errorMessage = "Transaction rejected by user."
                    } else if (typedError.reason) {
                        errorMessage = `Transaction failed: ${typedError.reason}`
                    } else if (typedError.message) {
                        errorMessage = typedError.message
                    }
                } else if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
                    errorMessage = (error as { message: string }).message
                }

                // Log transaction details if available in the error object
                if ('transaction' in error) {
                    console.error("Failed Transaction Object:", (error as { transaction: unknown }).transaction)
                }
            }

            toast({
                title: "Registration Failed",
                description: errorMessage,
                variant: "destructive",
            })
            // If the initial DB record was created but the blockchain part failed,
            // the record remains PENDING in the DB.
            if (pendingRecordCreated && !txHash) {
                console.log("Blockchain step failed after initial DB registration.")
                // Optionally inform the user their application is pending but needs transaction completion.
            }
        } finally {
            setIsRegistering(false)
        }
    }

    if (!showDialog) {
        return (
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <h4 className="font-medium">Register Campaign for Quadratic Funding</h4>
                    <p className="text-sm text-muted-foreground">
                        You&apos;ll need to register your campaign &quot;{campaignTitle}&quot; as a recipient on the blockchain to participate in this quadratic funding round.
                    </p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium">Campaign Payout Address</h4>
                    <p className="text-sm text-muted-foreground break-all">
                        {campaignWalletAddress}
                    </p>
                </div>
                <div className="space-y-2">
                    <h4 className="font-medium">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                        By registering, you agree to the terms and conditions of the round.
                        Your application will need to be reviewed by the round administrators.
                    </p>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={onComplete} disabled={isRegistering}>
                        Cancel
                    </Button>
                    <Button onClick={handleRegisterRecipient} disabled={isRegistering || !signer || !campaignWalletAddress}>
                        {isRegistering ? "Registering..." : "Register Campaign"}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={buttonVariant} disabled={disabled || !signer || !campaignWalletAddress}>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Register as Round Recipient</DialogTitle>
                    <DialogDescription>
                        Register your campaign &quot;{campaignTitle}&quot; as a recipient in this funding round.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Campaign Payout Address</h4>
                        <p className="text-sm text-muted-foreground break-all">
                            {campaignWalletAddress}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-medium">Important Notice</h4>
                        <p className="text-sm text-muted-foreground">
                            By registering, you agree to the terms and conditions of the round.
                            Your application will need to be reviewed by the round administrators.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        disabled={isRegistering}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleRegisterRecipient} disabled={isRegistering || !signer || !campaignWalletAddress}>
                        {isRegistering ? "Registering..." : "Register Campaign"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 