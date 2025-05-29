'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui';
import { countries, categories } from '@/lib/constant';
import { useAccount } from '@/contexts';
import { enableFormDefault } from '@/lib/develop';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useCreateCampaign, useUpdateCampaign } from '@/lib/hooks/useCampaigns';
import {
  useCreateCampaignContract,
  IOnCreateCampaignConfirmed,
} from '@/lib/web3/hooks/useCreateCampaignContract';

const campaignSchema = z.object({
  title: z.string(),
  description: z.string(),
  fundingGoal: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  location: z.string(),
  category: z.string(),
  bannerImage: z.instanceof(File).optional(),
});
type CampaignFormValues = z.infer<typeof campaignSchema>;
const defaultValues: CampaignFormValues = {
  title: '',
  description: '',
  fundingGoal: '',
  startTime: new Date().toISOString().slice(0, 16),
  endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16),
  location: '',
  category: '',
  bannerImage: undefined,
};
export function CampaignCreate() {
  const { address } = useAccount();

  const { toast } = useToast();
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  });
  const imageWatch = form.watch('bannerImage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const { mutateAsync: createCampaign, isPending: isCreateCampaignPending } =
    useCreateCampaign({ userAddress: address });
  const { mutateAsync: updateCampaign, isPending: isUpdateCampaignPending } =
    useUpdateCampaign({ userAddress: address });

  const onConfirmed = useCallback(
    async ({
      hash,
      status,
      campaignAddress,
      event,
    }: IOnCreateCampaignConfirmed) => {
      if (!campaignId) {
        return;
      }
      try {
        if (status === 'success') {
          toast({
            title: 'Transaction Confirmed',
            description: 'Updating campaign status...',
          });
          // First update the campaign status to pending_approval
          await updateCampaign({
            campaignId,
            transactionHash: hash,
            status: 'pending_approval',
            campaignAddress,
          });
          if (event) {
            // Get the campaign address from the event topics
            const campaignAddress = event.address;

            if (campaignAddress) {
              await updateCampaign({
                campaignId,
                campaignAddress,
              });
            }

            toast({
              title: 'Success!',
              description:
                'Campaign created successfully and pending approval.',
              variant: 'default',
            });
          }
        }
      } catch (error) {
        console.error('Error processing transaction:', error);
        toast({
          variant: 'destructive',
          title: 'Transaction Failed',
          description:
            error instanceof Error
              ? error.message
              : 'Campaign remains in draft state. Please try again.',
        });

        // Update campaign status to failed
        await updateCampaign({
          campaignId,
          status: 'failed',
          transactionHash: hash,
        });
        await updateCampaign({
          campaignId,
          transactionHash: hash,
          status: 'failed',
        });
      }
    },
    [campaignId, toast, updateCampaign],
  );
  const {
    createCampaignContract,
    isPending,
    isConfirming,
    isSuccess,
    createCampaignContractHash,
  } = useCreateCampaignContract({ onConfirmed });

  // Also add loading state toasts
  useEffect(() => {
    if (isPending) {
      toast({
        title: 'Transaction Pending',
        description: 'Please confirm the transaction in your wallet...',
      });
    }
    if (isConfirming) {
      toast({
        title: 'Transaction Confirming',
        description: 'Waiting for blockchain confirmation...',
      });
    }
    if (isSuccess && createCampaignContractHash) {
      toast({
        title: 'Transaction Confirmed',
        description: (
          <div>
            Transaction successful!{' '}
            <a
              href={`https://alfajores.celoscan.io/tx/${createCampaignContractHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-600"
            >
              View on Explorer
            </a>
          </div>
        ),
        variant: 'default',
      });
    }
  }, [isPending, isConfirming, isSuccess, createCampaignContractHash, toast]);

  const [dbError, setDbError] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (data: CampaignFormValues) => {
      setDbError(null);

      if (!address) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Wallet not connected or contract not available',
        });
        return;
      }

      try {
        toast({
          title: 'Creating Campaign',
          description: 'Saving campaign details to database...',
        });
        setIsSubmitting(true);
        try {
          const newCampaign = await createCampaign(data);
          toast({
            title: 'Campaign Saved',
            description: 'Initiating blockchain transaction...',
          });

          const { campaignId: newCampaignId } = newCampaign;
          setCampaignId(newCampaignId);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: error.message,
            });
            setDbError(error.message);
          }
          return;
        }
        await createCampaignContract({
          startTime: data.startTime,
          endTime: data.endTime,
          fundingGoal: data.fundingGoal,
        });
      } catch (error) {
        console.error('Error:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to create campaign. Your campaign has been saved as draft.',
        });
        setDbError(
          error instanceof Error
            ? error.message
            : 'Failed to create campaign. Your campaign has been saved as draft.',
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [address, toast, createCampaign, createCampaignContract],
  );
  const onDeveloperSubmit = useCallback(async () => {
    if (!enableFormDefault) {
      return;
    }
    await onSubmit({
      title: 'title',
      description: 'lorem ipsum description',
      fundingGoal: '100',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      location: 'Belgium',
      category: 'visual-arts',
    });
  }, [onSubmit]);
  useEffect(() => {
    if (!imageWatch) {
      return;
    }
    if (imageWatch instanceof File) {
      const url = URL.createObjectURL(imageWatch);
      setBannerImage(url);
      return () => {
        URL.revokeObjectURL(url);
        setBannerImage(null);
      };
    }
  }, [imageWatch]);

  const isCreating =
    isSubmitting ||
    isCreateCampaignPending ||
    isUpdateCampaignPending ||
    isPending ||
    isConfirming;
  const canCreate = Boolean(!isCreating);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="My Campaign"
                    {...field}
                    onDoubleClick={onDeveloperSubmit}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description of Campaign" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {bannerImage ? (
            <picture>
              <img src={bannerImage} alt="img-input" />
            </picture>
          ) : null}
          <FormField
            control={form.control}
            name="bannerImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign Banner Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      field.onChange(
                        event.target.files && event.target.files[0],
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fundingGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funding Goal (USDC)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!canCreate} className="w-full">
            {isCreating && <Loader2 className="animate-spin" />}Create
          </Button>
        </form>
      </Form>
      {dbError && <div className="text-center text-red-600">{dbError}</div>}

      {isSuccess && (
        <div className="text-center text-green-600">
          Campaign created successfully!
        </div>
      )}
    </div>
  );
}
