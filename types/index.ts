export interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  type: 'campaign' | 'article' | 'other';
  // Optional fields to maintain compatibility
  author?: string;
  location?: string;
  authorImage?: string;
  excerpt?: string;
  donations?: number;
  fundingGoal?: number;
  donationCount?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  stories: Story[];
  createdAt: Date;
}
import { type Campaign } from './campaign';

export interface CollectionContextType {
  userCollections: Collection[];
  isLoading: boolean;
  addToCollection: (
    campaign: Campaign,
    collectionName: string,
    createNew?: boolean,
  ) => Promise<void>;
  removeFromCollection: (
    storyId: string,
    collectionId: string,
  ) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  getCollection: (collectionId: string) => Collection | undefined;
  refreshCollections: () => Promise<void>;
}

export interface Favourite {
  id: string | number;
  campaign: Campaign;
}
