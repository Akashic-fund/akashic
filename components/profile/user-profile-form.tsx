'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useUpdateUserProfile } from '@/lib/hooks/useProfile';
import { type Profile } from '@/types/profile';

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: 'First Name must be at least 2 characters.',
    })
    .optional(),
  lastName: z
    .string()
    .min(2, {
      message: 'Last Name must be at least 2 characters.',
    })
    .optional(),
  uniqueUsername: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.',
    })
    .max(30, {
      message: 'Username cannot be longer than 30 characters.',
    }),
  avatarUrl: z
    .string()
    .url({
      message: 'Please enter a valid URL.',
    })
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(200, {
      message: 'Bio cannot be longer than 200 characters.',
    })
    .optional(),
  recipientWallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: 'Please enter a valid Ethereum address.',
    })
    .optional()
    .or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  profile?: Profile;
  onSuccess?: () => void;
}

export function UserProfileForm({ profile, onSuccess }: UserProfileFormProps) {
  const { address } = useAuth();
  const { toast } = useToast();
  const { mutateAsync: updateUserProfile, isPending } = useUpdateUserProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      uniqueUsername: profile?.username ?? '',
      recipientWallet: profile?.recipientWallet ?? '',
      bio: profile?.bio ?? '',
    },
  });

  // You can also log after setting up the form
  console.log('Form values:', form.getValues());

  const onSubmit = useCallback(
    async (data: ProfileFormValues) => {
      try {
        await updateUserProfile({
          userAddress: address ?? '',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          username: data.uniqueUsername,
          avatarUrl: data.avatarUrl,
          bio: data.bio,
          recipientWallet: data.recipientWallet || undefined,
        });
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to update profile. Please try again.',
          variant: 'destructive',
        });
      }
    },
    [updateUserProfile, address, toast, onSuccess],
  );

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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your First Name" {...field} />
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
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Last Name" {...field} />
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
                    Set a different wallet address to receive funds (leave empty
                    to use your connected wallet).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Short Biography" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is a short Biography to be shared on the platform.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
