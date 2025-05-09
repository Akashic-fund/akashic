'use client';

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTransition } from 'react';
import { useRef } from 'react';

interface CommentFormProps {
  onSubmit: (formData: FormData, userAddress: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const { address } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const walletAddress = address;
    if (!walletAddress) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet to comment',
      });
      return;
    }

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await onSubmit(formData, walletAddress);
        // Clear the form using ref
        formRef.current?.reset();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to post comment',
        });
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="rounded-lg bg-white p-4 shadow">
        <textarea
          name="content"
          className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Write a comment..."
          rows={4}
          required
        />
        <Button type="submit" className="mt-2" disabled={isPending}>
          {isPending ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  );
}
