'use server';
import { db } from '@/server/db';
import { CampaignDisplay } from '@/types/campaign';
import { revalidatePath } from 'next/cache';

export async function campaignUpdateFormAction(
  campaign: CampaignDisplay,
  formData: FormData,
  userAddress: string,
) {
  try {
    const title = formData.get('title');
    const content = formData.get('content');

    if (
      !title ||
      !content ||
      typeof title !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('Invalid form data');
    }

    if (!userAddress) {
      throw new Error('Please connect your wallet to post update');
    }

    if (userAddress.toLowerCase() !== campaign.creatorAddress.toLowerCase()) {
      throw new Error('Only the campaign creator can post updates');
    }

    const update = await db.campaignUpdate.create({
      data: {
        title: title,
        content: content,
        campaignId: campaign.id,
        creatorAddress: userAddress,
      },
    });

    console.log('Created update:', update);
    revalidatePath(`/campaigns/${campaign.slug}`);
  } catch (error) {
    console.error('Failed to create update:', error);
    throw error instanceof Error ? error : new Error('Failed to create update');
  }
}
