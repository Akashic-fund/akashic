export interface DbCampaign {
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
  treasuryAddress?: string | null;
  category?: string | null;
  createdAt: Date;
  updatedAt: Date;
  images?: {
    id: number;
    imageUrl: string;
    isMainImage: boolean;
    campaignId: number;
  }[];
  slug: string;
  location?: string | null;
  updates?: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    campaignId: number;
    creatorAddress: string;
  }[];
  rounds?: { id: number; title: string }[];
}

export type CampaignDisplay = {
  id: number;
  title: string;
  description: string;
  fundingGoal: string;
  startTime: Date;
  endTime: Date;
  creatorAddress: string;
  status: string;
  transactionHash?: string | null;
  createdAt: Date;
  updatedAt: Date;
  campaignAddress?: string | null;
  slug: string;
  location?: string | null;
  treasuryAddress?: string | null;
  images: CampaignImage[];
  payments?: Payment[];
  comments?: Comment[];
  updates?: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    campaignId: number;
    creatorAddress: string;
  }[];
};

export type Comment = {
  id: number;
  content: string;
  userAddress: string;
  createdAt: Date;
  updatedAt: Date;
  campaignId: number;
  campaign?: Campaign;
};

export type CampaignImage = {
  id: number;
  imageUrl: string;
  isMainImage: boolean;
  campaignId: number;
  campaign?: Campaign;
};

export type Payment = {
  id: number;
  amount: string; // Stored as string to preserve precision
  token: string; // e.g., "USDC"
  status: 'pending' | 'confirmed' | 'failed'; // Assuming possible statuses
  transactionHash?: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  campaignId: number;
  campaign?: Campaign;
  userId: number;
  user: User; // Assuming you have a corresponding type for User
};

type User = {
  id: number;
  address: string;
  payments?: Payment[];
  createdAt: Date;
  updatedAt: Date;
};

export interface Campaign extends DbCampaign {
  address: string;
  owner: string;
  launchTime: string;
  deadline: string;
  goalAmount: string;
  totalRaised: string;
  location: string | null;
  amountRaised?: string;
}

export interface CombinedCampaignData {
  id: number;
  title: string;
  description: string;
  status: string;
  address: string;
  owner: string;
  launchTime: string;
  deadline: string;
  goalAmount: string;
  totalRaised: string;
  images: DbCampaign['images'];
  location: string | null;
  treasuryAddress: string | null;
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
