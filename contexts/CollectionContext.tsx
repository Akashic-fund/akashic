'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Collection, CollectionContextType } from '@/types';
import type { Campaign } from '@/types/campaign';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

const CollectionContext = createContext<CollectionContextType>({
  userCollections: [],
  isLoading: false,
  addToCollection: async () => {},
  removeFromCollection: async () => {},
  deleteCollection: async () => {},
  getCollection: () => undefined,
  refreshCollections: async () => {},
});

export const useCollection = () => useContext(CollectionContext);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userCollections, setUserCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { address, authenticated } = useAuth();

  const fetchCollections = async () => {
    if (!authenticated || !address) return;

    setIsLoading(true);
    try {
      const userAddress = address;
      const response = await fetch(
        `/api/collections?userAddress=${userAddress}`,
      );
      const data = await response.json();

      if (response.ok) {
        // Transform the API response to match our Collection interface
        const collections = data.collections.map(
          (collection: {
            id: string;
            name: string;
            description?: string;
            createdAt: string;
            items: Array<{
              itemId: string;
              itemType: string;
              details?: {
                id: number;
                title?: string;
                description?: string;
                image?: string;
                slug?: string;
              };
            }>;
          }) => ({
            id: collection.id,
            name: collection.name,
            description: collection.description,
            createdAt: new Date(collection.createdAt),
            stories: collection.items.map((item) => ({
              id: item.itemId,
              title: item.details?.title || 'Unknown',
              description: item.details?.description || '',
              image: item.details?.image || '/images/placeholder.svg',
              slug: item.details?.slug || '',
              type: item.itemType,
            })),
          }),
        );
        setUserCollections(collections);
      } else {
        console.error('Failed to fetch collections:', data.error);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch collections when user is authenticated
  useEffect(() => {
    if (authenticated && address) {
      fetchCollections();
    } else {
      setUserCollections([]);
    }
  }, [authenticated, address]);

  const refreshCollections = async () => {
    await fetchCollections();
  };

  const addCampaignToCollection = async (
    campaign: Campaign,
    collectionId: string,
  ) => {
    try {
      console.log('Adding campaign to collection:', { campaign, collectionId });

      // Convert campaign.id to string if it's a number
      const campaignId =
        typeof campaign.id === 'number' ? campaign.id.toString() : campaign.id;

      if (!address) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: campaignId, // Use the converted ID
          itemType: 'campaign',
          userAddress: address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error adding item to collection:', errorData);
        throw new Error('Failed to add item to collection');
      }

      toast({
        title: 'Added to collection',
        description: 'Campaign has been added to your collection',
      });

      return response.json();
    } catch (error) {
      console.error('Error adding item to collection:', error);
      toast({
        title: 'Failed to add to collection',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const addToCollection = async (
    campaign: Campaign,
    collectionName: string,
    isNewCollection = false,
  ) => {
    try {
      if (!address) {
        throw new Error('User not authenticated');
      }

      console.log(
        `Creating new collection: ${collectionName} for user: ${address}`,
      );

      if (isNewCollection) {
        // Create a new collection
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: collectionName,
            userAddress: address,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Collection creation error:', errorData);
          throw new Error('Failed to create collection');
        }

        const { collection } = await response.json();

        // Now add the campaign to the newly created collection
        await addCampaignToCollection(campaign, collection.id);

        // Add toast notification for success
        toast({
          title: 'Collection created',
          description: `"${collectionName}" has been created with your campaign`,
        });

        // Refresh collections to show the new one
        await refreshCollections();
      } else {
        // Add to existing collection - collectionName is actually the collection ID here
        await addCampaignToCollection(campaign, collectionName);
      }
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast({
        title: 'Failed to add to collection',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const removeFromCollection = async (
    storyId: string,
    collectionId: string,
  ) => {
    if (!authenticated || !address) return;

    const userAddress = address;
    try {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: storyId,
          userAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item from collection');
      }

      // Update local state
      setUserCollections((prevCollections) =>
        prevCollections.map((collection) => {
          if (collection.id === collectionId) {
            return {
              ...collection,
              stories: collection.stories.filter(
                (story) => story.id !== storyId,
              ),
            };
          }
          return collection;
        }),
      );

      toast({
        title: 'Removed from collection',
        description: 'Item has been removed from the collection',
      });
    } catch (error) {
      console.error('Error removing from collection:', error);
      toast({
        title: 'Failed to remove from collection',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const deleteCollection = async (collectionId: string) => {
    if (!authenticated || !address) return;

    const userAddress = address;
    try {
      const response = await fetch(
        `/api/collections/${collectionId}?userAddress=${userAddress}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete collection');
      }

      // Update local state
      setUserCollections((prevCollections) =>
        prevCollections.filter((collection) => collection.id !== collectionId),
      );

      toast({
        title: 'Collection deleted',
        description: 'The collection has been deleted',
      });
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast({
        title: 'Failed to delete collection',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const getCollection = (collectionId: string) => {
    return userCollections.find((collection) => collection.id === collectionId);
  };

  return (
    <CollectionContext.Provider
      value={{
        userCollections,
        isLoading,
        addToCollection,
        removeFromCollection,
        deleteCollection,
        getCollection,
        refreshCollections,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
