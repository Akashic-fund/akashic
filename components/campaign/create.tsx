'use client';

import { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { CampaignInfoFactoryABI } from '@/contracts/abi/CampaignInfoFactory';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { keccak256, stringToHex } from 'viem';
import { Log } from 'viem';
import { useToast } from '@/hooks/use-toast';
import {
  Button,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import Image from 'next/image';
import { countries, categories } from '@/lib/constant';
import { useAccount } from '@/contexts';

export function CampaignCreate() {
  const { address } = useAccount();
  const campaignInfoFactory = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    location: '',
    category: '',
    bannerImage: null as File | null,
    bannerImagePreview: '',
  });

  const { data: hash, isPending, writeContract } = useWriteContract();
  const [campaignId, setCampaignId] = useState<number | null>(null);

  console.log('Current transaction hash:', hash);

  const {
    isLoading: isConfirming,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const [slug, setSlug] = useState('');

  // Add validation for slug
  const validateSlug = (value: string) => {
    return value.length === 6 && /^[a-zA-Z0-9-]+$/.test(value);
  };

  useEffect(() => {
    const updateCampaign = async () => {
      if (hash && isSuccess && campaignId && receipt) {
        const campaignAddress = receipt.logs[0].address;

        try {
          if (receipt.status === 'success') {
            toast({
              title: 'Transaction Confirmed',
              description: 'Updating campaign status...',
            });

            // First update the campaign status to pending_approval
            const response = await fetch('/api/campaigns/user', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                campaignId,
                transactionHash: hash,
                campaignAddress: campaignAddress,
                status: 'pending_approval',
              }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.error ||
                  errorData.error ||
                  'Failed to update campaign status',
              );
            }

            // Then find the event and update campaign address
            const event = receipt.logs.find(
              (log: Log) => log.transactionHash === hash,
            );

            console.log('Event:', event);

            if (event) {
              // Get the campaign address from the event topics
              const campaignAddress = event.address;

              if (campaignAddress) {
                const addressResponse = await fetch('/api/campaigns/user', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    campaignId,
                    campaignAddress,
                  }),
                });

                if (!addressResponse.ok) {
                  const errorData = await addressResponse.json();
                  console.error(
                    'Failed to update campaign address:',
                    errorData,
                  );
                }
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
          await fetch('/api/campaigns/user', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              campaignId,
              status: 'failed',
              transactionHash: hash,
            }),
          });
        }
      }
    };

    updateCampaign();
  }, [hash, isSuccess, campaignId, receipt, toast]);

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
    if (isSuccess && hash) {
      toast({
        title: 'Transaction Confirmed',
        description: (
          <div>
            Transaction successful!{' '}
            <a
              href={`https://alfajores.celoscan.io/tx/${hash}`}
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
  }, [isPending, isConfirming, isSuccess, hash, toast]);

  const [dbError, setDbError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        bannerImage: file,
        bannerImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError(null);

    if (!writeContract || !address) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Wallet not connected or contract not available',
      });
      return;
    }

    if (!validateSlug(slug)) {
      // Handle invalid slug
      return;
    }

    try {
      toast({
        title: 'Creating Campaign',
        description: 'Saving campaign details to database...',
      });

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('fundingGoal', formData.fundingGoal);
      formDataToSend.append('startTime', formData.startTime);
      formDataToSend.append('endTime', formData.endTime);
      formDataToSend.append('creatorAddress', address);
      formDataToSend.append('status', 'draft');
      formDataToSend.append('location', formData.location);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('slug', slug);
      if (formData.bannerImage) {
        formDataToSend.append('bannerImage', formData.bannerImage);
      }

      // First, save to database with draft status
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        let errorMsg = 'Failed to save campaign';
        try {
          const errorData = await response.json();
          errorMsg = errorData?.error
            ? `${errorData.error}${errorData.details ? ': ' + errorData.details : ''}`
            : errorMsg;
        } catch {}
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMsg,
        });
        setDbError(errorMsg);
        return;
      }

      toast({
        title: 'Campaign Saved',
        description: 'Initiating blockchain transaction...',
      });

      const { campaignId: newCampaignId } = await response.json();
      setCampaignId(newCampaignId);

      const campaignData = {
        launchTime: BigInt(new Date(formData.startTime ?? '').getTime() / 1000),
        deadline: BigInt(new Date(formData.endTime ?? '').getTime() / 1000),
        goalAmount: parseEther(formData.fundingGoal || '0'),
        slug: slug,
      };

      // Then proceed with blockchain transaction
      const identifierHash = keccak256(stringToHex('KickStarter'));
      await writeContract({
        address: campaignInfoFactory as `0x${string}`,
        abi: CampaignInfoFactoryABI,
        functionName: 'createCampaign',
        args: [
          address,
          identifierHash,
          [process.env.NEXT_PUBLIC_PLATFORM_HASH as `0x${string}`],
          [], // Platform data keys
          [], // Platform data values
          campaignData,
        ],
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Select
          value={formData.location}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, location: value }))
          }
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
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Campaign Banner Image</label>
        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          {formData.bannerImagePreview && (
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <Image
                src={formData.bannerImagePreview}
                alt="Campaign banner preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Funding Goal (USDC)</label>
        <Input
          type="number"
          step="0.01"
          value={formData.fundingGoal}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fundingGoal: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Time</label>
        <Input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, startTime: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End Time</label>
        <Input
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, endTime: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Campaign Slug (6 characters)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value.slice(0, 6))}
          placeholder="abc123"
          maxLength={6}
        />
        {slug && !validateSlug(slug) && (
          <p className="text-sm text-red-500">
            Slug must be exactly 6 characters and contain only letters, numbers,
            or hyphens
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending || isConfirming || !writeContract}
        className="w-full"
      >
        {isPending || isConfirming ? 'Creating...' : 'Create Campaign'}
      </Button>

      {dbError && <div className="text-center text-red-600">{dbError}</div>}

      {isSuccess && (
        <div className="text-center text-green-600">
          Campaign created successfully!
        </div>
      )}
    </form>
  );
}
