import { prisma } from '@/lib/prisma';
import { Campaign, CampaignImage, Payment, User } from '@prisma/client';

export type PaymentWithUser = Payment & {
  user: User;
};

export type CampaignWithRelations = Campaign & {
  images: CampaignImage[];
  payments: PaymentWithUser[];
};

export async function getCampaignBySlug(
  slug: string,
): Promise<CampaignWithRelations | null> {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        images: true,
        payments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!campaign) {
      return null;
    }

    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}
