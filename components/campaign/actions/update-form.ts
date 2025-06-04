'use server';
import { checkAuth } from '@/lib/api/auth';
import { db } from '@/server/db';
import { CampaignDisplay } from '@/types/campaign';
import { revalidatePath } from 'next/cache';

export async function campaignUpdateFormAction(
  campaign: CampaignDisplay,
  formData: FormData,
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
    const session = await checkAuth(['user']);

    if (session.user.address !== campaign.creatorAddress) {
      throw new Error('Only the campaign creator can post updates');
    }

    const update = await db.campaignUpdate.create({
      data: {
        title: title,
        content: content,
        campaignId: campaign.id,
        creatorAddress: session.user.address,
      },
    });

    console.log('Created update:', update);
    revalidatePath(`/campaigns/${campaign.slug}`);
  } catch (error) {
    console.error('Failed to create update:', error);
    throw error instanceof Error ? error : new Error('Failed to create update');
  }
}
