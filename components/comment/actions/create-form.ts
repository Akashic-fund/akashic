'use server';
import { db } from '@/server/db';
import { CampaignDisplay } from '@/types/campaign';
import { revalidatePath } from 'next/cache';

export async function commentCreateFormAction(
  campaign: CampaignDisplay,
  formData: FormData,
  userAddress: string,
) {
  const content = formData.get('content') as string;

  // Double check wallet connection on server side
  if (!userAddress) {
    throw new Error('Please connect your wallet to comment');
  }

  try {
    const comment = await db.comment.create({
      data: {
        content,
        userAddress,
        campaignId: campaign.id,
      },
    });
    console.log('comment', comment);
    revalidatePath(`/campaigns/${campaign.slug}`);
  } catch (error) {
    console.error('Failed to create comment:', error);
    throw new Error('Failed to create comment');
  }
}
