import { Campaign as CampaignType, CampaignDisplay } from '@/types/campaign';
import { prisma } from './prisma';
import { notFound } from 'next/navigation';

type CampaignWithRelations = {
  id: number;
  title: string;
  description: string;
  fundingGoal: string;
  startTime: Date;
  endTime: Date;
  creatorAddress: string;
  status: string;
  transactionHash: string | null;
  campaignAddress: string | null;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  location: string | null;
  treasuryAddress: string | null;
  images: {
    id: number;
    imageUrl: string;
    isMainImage: boolean;
    campaignId: number;
  }[];
  payments: {
    id: number;
    amount: string;
    token: string;
    status: string;
    transactionHash: string | null;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
    campaignId: number;
    userId: number;
    user: {
      id: number;
      address: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
  comments: {
    id: number;
    content: string;
    userAddress: string;
    createdAt: Date;
    updatedAt: Date;
    campaignId: number;
  }[];
  updates: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    campaignId: number;
    creatorAddress: string;
  }[];
};

export type CampaignUpdate = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  campaignId: number;
  creatorAddress: string;
};

export async function getCampaignUpdates(
  campaignId: number,
): Promise<CampaignUpdate[]> {
  try {
    const updates = await prisma.campaignUpdate.findMany({
      where: {
        campaignId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return updates;
  } catch (error) {
    console.error('Error fetching campaign updates:', error);
    return [];
  }
}

export async function getCampaign(
  slug: string,
): Promise<CampaignType & CampaignDisplay> {
  console.log('getCampaign', slug);
  // Get the campaign with all relations
  const dbCampaign = (await prisma.campaign.findUnique({
    where: { slug },
    include: {
      images: true,
      payments: {
        include: {
          user: true,
        },
      },
      comments: true,
      updates: true,
    },
  })) as CampaignWithRelations | null;

  if (!dbCampaign) {
    notFound();
  }

  // Convert the payment data to match the expected types
  const payments = dbCampaign.payments.map((payment) => ({
    ...payment,
    status: payment.status as 'pending' | 'confirmed' | 'failed',
    transactionHash: payment.transactionHash || undefined,
  }));

  // Convert the data to match the expected types
  const result: CampaignType & CampaignDisplay = {
    ...dbCampaign,
    images: dbCampaign.images || [],
    payments: payments,
    comments: dbCampaign.comments || [],
    updates: dbCampaign.updates || [],
    address: dbCampaign.campaignAddress || '',
    owner: dbCampaign.creatorAddress,
    launchTime: Math.floor(
      new Date(dbCampaign.startTime).getTime() / 1000,
    ).toString(),
    deadline: Math.floor(
      new Date(dbCampaign.endTime).getTime() / 1000,
    ).toString(),
    goalAmount: dbCampaign.fundingGoal,
    totalRaised: '0',
    amountRaised: '0',
    location: dbCampaign.location,
  };

  return result;
}
