'use client';

import { useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts';
import { useUserProfile } from '@/lib/hooks/useProfile';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCrowdsplitUpdateWalletAddress } from '@/lib/crowdsplit/hooks/useCrowdsplit';
const walletAddressSchema = z.object({
  walletAddress: z
    .string()
    .min(42, 'Ethereum address must be 42 characters')
    .max(42, 'Ethereum address must be 42 characters')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
    .optional()
    .or(z.literal('')),
});

type WalletAddressFormValues = z.infer<typeof walletAddressSchema>;

interface WalletAddressesFormProps {
  onSuccess?: () => void;
}

export function WalletAddressesForm({ onSuccess }: WalletAddressesFormProps) {
  const router = useRouter();
  const { address } = useAuth();
  const { data: profile, isPending: isUserProfilePending } =
    useUserProfile(address);
  const {
    mutateAsync: updateWalletAddress,
    isPending: isUpdateUserProfilePending,
  } = useCrowdsplitUpdateWalletAddress({ userAddress: address ?? '' });

  const form = useForm<WalletAddressFormValues>({
    resolver: zodResolver(walletAddressSchema),
    defaultValues: {
      walletAddress: '',
    },
  });
  useEffect(() => {
    if (profile?.recipientWallet) {
      form.setValue('walletAddress', profile.recipientWallet);
    }
  }, [form, profile?.recipientWallet]);

  const onSubmit = useCallback(
    async (data: WalletAddressFormValues) => {
      if (!address) {
        toast({
          title: 'Error',
          description:
            'Customer ID is required. Please complete your personal information first.',
          variant: 'destructive',
        });
        return;
      }

      try {
        await updateWalletAddress({
          walletAddress: data.walletAddress ?? '',
        });

        toast({
          title: 'Success',
          description: 'Your recipient wallet address has been saved.',
        });

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        router.push('/profile');
      } catch (error) {
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'An error occurred while saving your wallet address',
          variant: 'destructive',
        });
      }
    },
    [address, onSuccess, updateWalletAddress, router],
  );

  return (
    <Card>
      <CardHeader>
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
            <code
              className={cn(
                'relative mt-2 block break-all rounded bg-muted px-[0.3rem] py-[0.2rem]',
                'font-mono text-sm',
              )}
            >
              {!address || isUserProfilePending ? 'Not connected' : address}
            </code>
            {typeof profile?.recipientWallet === 'string' &&
              profile.recipientWallet.length > 0 && (
                <>
                  <div className="mt-2">Your current recipient wallet is:</div>
                  <code
                    className={cn(
                      'relative mt-2 block break-all rounded bg-muted px-[0.3rem] py-[0.2rem]',
                      'font-mono text-sm',
                    )}
                  >
                    {profile.recipientWallet ?? address}
                  </code>
                </>
              )}
          </AlertDescription>
        </Alert>

        <div>
          <h3 className="mb-4 text-lg font-medium">
            Set Recipient Wallet Address
          </h3>
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
                      Enter an Ethereum wallet address where you would like to
                      receive funds. Leave empty to use your connected wallet.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdateUserProfilePending}>
                {isUpdateUserProfilePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Recipient Address'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
