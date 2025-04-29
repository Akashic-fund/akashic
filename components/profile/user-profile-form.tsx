"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Button, Input, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { User } from "@prisma/client"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(30, {
        message: "Username cannot be longer than 30 characters."
    }),
    uniqueUsername: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(30, {
        message: "Username cannot be longer than 30 characters."
    }),
    avatarUrl: z.string().url({
        message: "Please enter a valid URL.",
    }).optional().or(z.literal('')),
    bio: z.string().max(200, {
        message: "Bio cannot be longer than 200 characters."
    }).optional(),
    recipientWallet: z.string()
        .regex(/^0x[a-fA-F0-9]{40}$/, {
            message: "Please enter a valid Ethereum address.",
        })
        .optional()
        .or(z.literal(''))
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface UserProfileFormProps {
    userData: User
    walletAddress: string
}

export function UserProfileForm({ userData, walletAddress }: UserProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    console.log("userData received:", userData);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: userData?.firstName + (userData?.lastName ? " " + userData.lastName : "") || "",
            uniqueUsername: userData?.username || "",
            recipientWallet: userData?.recipientWallet || ""
        },
    })

    // You can also log after setting up the form
    console.log("Form values:", form.getValues());

    async function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/users/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userAddress: walletAddress,
                    firstName: data.name,
                    username: data.uniqueUsername,
                    avatarUrl: data.avatarUrl,
                    bio: data.bio,
                    recipientWallet: data.recipientWallet || undefined
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update profile");
            }

            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
            })
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                    Update your profile information below.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This will be your display name on the platform.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="uniqueUsername"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your_unique_username" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This will be your unique identifier on the platform.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="recipientWallet"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Wallet Address (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Set a different wallet address to receive funds (leave empty to use your connected wallet).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : "Update Profile"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 