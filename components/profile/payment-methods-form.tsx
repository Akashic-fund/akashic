"use client"

import { useState } from "react"
import { useWallets } from '@privy-io/react-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import {CreditCard, Landmark, Loader2, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaymentMethod } from "@prisma/client"

// Define interface for the bank details structure
interface BankDetails {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: "CHECKING" | "SAVINGS";
    accountName: string;
    provider: "BRIDGE";
}

const bankAccountSchema = z.object({
    type: z.literal("BANK"),
    bank_details: z.object({
        provider: z.literal("BRIDGE"),
        bankName: z.string().min(2, "Bank name is required"),
        accountNumber: z.string().min(4, "Account number is required"),
        routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits"),
        accountType: z.enum(["CHECKING", "SAVINGS"]),
        accountName: z.string().min(2, "Account name is required"),
    }),
})

type BankAccountFormValues = z.infer<typeof bankAccountSchema>

interface PaymentMethodsFormProps {
    customerId: string
    paymentMethods: PaymentMethod[]
    onSuccess: (paymentMethods: PaymentMethod[]) => void
}

export function PaymentMethodsForm({ customerId, paymentMethods, onSuccess }: PaymentMethodsFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const { wallets } = useWallets()
    const wallet = wallets[0]

    const form = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: {
            type: "BANK",
            bank_details: {
                provider: "BRIDGE",
                bankName: "",
                accountNumber: "",
                routingNumber: "",
                accountType: "CHECKING",
                accountName: "",
            },
        }
    })

    const onSubmit = async (data: BankAccountFormValues) => {
        if (!wallet || !(await wallet.isConnected())) {
            toast({
                title: "Error",
                description: "Please connect your wallet first",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSubmitting(true)
            const userAddress = await wallet.address

            console.log('Submitting payment method:', {
                type: data.type,
                customerId,
                bank_details: {
                    ...data.bank_details,
                    accountNumber: '****' + data.bank_details.accountNumber.slice(-4) 
                }
            });

            const response = await fetch('/api/bridge/payment-methods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress,
                    customerId,
                    type: data.type,
                    bank_details: data.bank_details,
                }),
            })

            const responseData = await response.json()

            if (!response.ok) {
                console.error('Payment method API error:', responseData);
                throw new Error(responseData.error || 'Failed to add payment method')
            }

            // Refresh payment methods
            const methodsResponse = await fetch(`/api/bridge/payment-methods?userAddress=${userAddress}`)
            const methodsData = await methodsResponse.json()

            onSuccess(methodsData.paymentMethods || [])
            setShowAddDialog(false)
            form.reset()
            
            toast({
                title: "Success",
                description: "Payment method added successfully",
            })
        } catch (error) {
            console.error("Error adding payment method:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add payment method",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeletePaymentMethod = async (paymentMethodId: string) => {
        if (!wallet || !(await wallet.isConnected())) {
            toast({
                title: "Error",
                description: "Please connect your wallet first",
                variant: "destructive",
            })
            return
        }

        try {
            setIsDeleting(paymentMethodId)
            const userAddress = await wallet.address

            const response = await fetch(`/api/bridge/payment-methods/${paymentMethodId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerId,
                    userAddress,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete payment method')
            }

            // Refresh payment methods
            const methodsResponse = await fetch(`/api/bridge/payment-methods?userAddress=${userAddress}`)
            const methodsData = await methodsResponse.json()

            onSuccess(methodsData.paymentMethods || [])
            toast({
                title: "Success",
                description: "Payment method deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting payment method:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete payment method",
                variant: "destructive",
            })
        } finally {
            setIsDeleting(null)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                        Add or manage your payment methods for donations.
                    </CardDescription>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button>Add Payment Method</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Bank Account</DialogTitle>
                            <DialogDescription>
                                Add your bank account details to enable bank transfers.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="bank_details.bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bank Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Chase, Bank of America, etc." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bank_details.accountName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Holder Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bank_details.accountNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Account Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="12345678901" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bank_details.routingNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Routing Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123456789" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="bank_details.accountType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Account Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select account type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CHECKING">Checking</SelectItem>
                                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : "Add Bank Account"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {paymentMethods.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Landmark className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg mb-2">No payment methods added</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add a bank account to make donations via direct bank transfer.
                        </p>
                        <Button onClick={() => setShowAddDialog(true)}>
                            Add Bank Account
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paymentMethods.map((method: PaymentMethod) => {
                                    // Safe casting of details to expected type
                                    const details = method.details as unknown as BankDetails | null;
                                    
                                    return (
                                        <TableRow key={method.id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    {method.type === 'BANK' ? (
                                                        <Landmark className="h-4 w-4 mr-2" />
                                                    ) : (
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                    )}
                                                    {method.type === 'BANK' ? 'Bank Account' : 'Card'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {method.type === 'BANK' && details && (
                                                    <div className="text-sm">
                                                        <p>{details.bankName}</p>
                                                        <p className="text-muted-foreground">
                                                            {details.accountType.charAt(0) + details.accountType.slice(1).toLowerCase()} ••••
                                                            {details.accountNumber.slice(-4)}
                                                        </p>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeletePaymentMethod(method.externalId)}
                                                    disabled={isDeleting === method.externalId}
                                                >
                                                    {isDeleting === method.externalId ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    )}
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowAddDialog(true)}
                        >
                            Add Another Payment Method
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 