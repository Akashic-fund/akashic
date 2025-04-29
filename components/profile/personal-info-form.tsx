"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { countries } from "@/lib/constant"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const personalInfoSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    document_type: z.enum(["ITIN", "SSN"]),
    document_number: z.string().regex(/^9\d{8}$/, "Document number must be a 9-digit number starting with 9"),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    street_number: z.string().min(1, "Street number is required"),
    street_name: z.string().min(1, "Street name is required"),
    neighborhood: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    address_country_id: z.number().min(1, "Country is required"),
    postal_code: z.string().min(5, "Postal code must be at least 5 characters"),
    phone_country_code: z.string().min(1, "Country code is required"),
    phone_area_code: z.string().min(1, "Area code is required"),
    phone_number: z.string().min(7, "Phone number must be at least 7 characters"),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInfoFormProps {
    hasCustomer: boolean
    customerId: string | null
    onSuccess: (customerId: string) => void
}

export function PersonalInfoForm({ hasCustomer, customerId, onSuccess }: PersonalInfoFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { address, isConnected } = useAccount()

    const form = useForm<PersonalInfoFormValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            document_type: "ITIN",
            document_number: "",
            dob: "",
            street_number: "",
            street_name: "",
            neighborhood: "",
            city: "",
            state: "",
            address_country_id: 2, // Default to US
            postal_code: "",
            phone_country_code: "1", // Default to US
            phone_area_code: "",
            phone_number: "",
        }
    })

    const onSubmit = async (data: PersonalInfoFormValues) => {
        if (!address || !isConnected) {
            toast({
                title: "Error",
                description: "Please connect your wallet first",
                variant: "destructive",
            })
            return
        }

        try {
            setIsSubmitting(true)
            const userAddress = address

            console.log("Submitting customer data:", {
                ...data,
                userAddress,
                customer_wallet: userAddress
            })

            const response = await fetch('/api/bridge/customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    userAddress,
                    customer_wallet: userAddress
                }),
            })

            const responseData = await response.json()

            if (!response.ok) {
                console.error("Bridge API error response:", responseData)
                throw new Error(responseData.error || responseData.message || 'Failed to create customer')
            }

            console.log("Customer created successfully:", responseData)
            onSuccess(responseData.customerId)
        } catch (error) {
            console.error("Error creating customer:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save personal information",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    {hasCustomer
                        ? "Your information is verified. You can proceed to KYC verification."
                        : "Fill in your personal details to create your Bridge customer account."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {hasCustomer ? (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-600">Customer Account Created</AlertTitle>
                        <AlertDescription className="text-green-600">
                            Your customer account has been created successfully. Customer ID: {customerId}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john.doe@example.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="dob"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date of Birth</FormLabel>
                                            <FormControl>
                                                <Input placeholder="YYYY-MM-DD" {...field} />
                                            </FormControl>
                                            <FormDescription>Format: YYYY-MM-DD</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="document_type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Document Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select document type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="ITIN">ITIN</SelectItem>
                                                    <SelectItem value="SSN">SSN</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="document_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Document Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="9XXXXXXXX" {...field} />
                                            </FormControl>
                                            <FormDescription>Must be a 9-digit number starting with 9</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="col-span-1 md:col-span-2">
                                    <div className="text-lg font-medium mb-4">Address Information</div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="street_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="street_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Main Street" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="neighborhood"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Neighborhood</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Downtown" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="New York" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input placeholder="US-CA" {...field} />
                                            </FormControl>
                                            <FormDescription>Format: US-XX (state code)</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="postal_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Postal Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="10001" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="address_country_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(parseInt(value))}
                                                defaultValue={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="2">United States</SelectItem>
                                                    {/* Add more countries as needed */}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="col-span-1 md:col-span-2">
                                    <div className="text-lg font-medium mb-4">Phone Information</div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="phone_country_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="1" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone_area_code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Area Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="212" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone_number"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="5551234" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Save Personal Information"}
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
} 