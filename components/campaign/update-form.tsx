'use client';

import { useRef, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts';

interface CampaignUpdateFormProps {
  creatorAddress: string;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function CampaignUpdateForm({
  creatorAddress,
  onSubmit,
}: CampaignUpdateFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const { address: userAddress } = useAuth();

  const isOwner = userAddress?.toLowerCase() === creatorAddress?.toLowerCase();

  if (!isOwner) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userAddress) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet to post an update',
      });
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit(new FormData(e.currentTarget));
        formRef.current?.reset();
        toast({
          title: 'Success!',
          description: 'Campaign update posted successfully.',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to post update',
        });
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input name="title" placeholder="Update Title" required />
      </div>
      <div>
        <Textarea
          name="content"
          placeholder="Share your campaign progress..."
          required
          className="min-h-[150px]"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Posting...' : 'Post Update'}
      </Button>
    </form>
  );
}
