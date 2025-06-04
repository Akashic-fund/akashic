'use server';
import { checkAuth } from '@/lib/api/auth';
import { db } from '@/server/db';
import { CampaignDisplay } from '@/types/campaign';
import { revalidatePath } from 'next/cache';

export async function commentCreateFormAction(
  campaign: CampaignDisplay,
  formData: FormData,
) {
  const session = await checkAuth(['user']);

  const content = formData.get('content') as string;

  try {
    const comment = await db.comment.create({
      data: {
        content,
        userAddress: session.user.address,
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
