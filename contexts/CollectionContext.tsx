'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { Collection } from '@/types';
import {
  useCreateCollection,
  useCreateItemInCollection,
  useDeleteCollection,
  useDeleteItemFromCollection,
  useFeaturedCollections,
  useUpdateCollection,
  useUserCollections,
} from '@/lib/hooks/useCollections';

export interface CollectionContextType {
  userCollections: Collection[];
  featuredCollections: Collection[];
  isLoading: boolean;
  createCollection: ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => Promise<Collection>;
  createItemInCollection: ({
    collectionId,
    itemId,
    itemType,
  }: {
    collectionId: string;
    itemId: string;
    itemType: string;
  }) => Promise<void>;

  deleteItemFromCollection: ({
    itemId,
    collectionId,
  }: {
    itemId: string;
    collectionId: string;
  }) => Promise<void>;
  deleteCollection: ({
    collectionId,
  }: {
    collectionId: string;
  }) => Promise<void>;
  updateCollection: ({
    collectionId,
    name,
    description,
  }: {
    collectionId: string;
    name: string;
    description: string;
  }) => Promise<void>;
  // getCollection: (collectionId: string) => Collection | undefined;
  // refreshCollections: () => Promise<void>;
}

const CollectionContext = createContext<CollectionContextType>({
  userCollections: [],
  featuredCollections: [],
  isLoading: false,
  createCollection: async ({ name }: { name: string }) => {
    throw new Error(`cannot create ${name} - context not initialized`);
  },
  createItemInCollection: async ({
    collectionId,
    itemId,
    itemType,
  }: {
    collectionId: string;
    itemId: string;
    itemType: string;
  }) => {
    throw new Error(
      `cannot create item ${itemId} of type ${itemType} in ${collectionId} - context not initialized`,
    );
  },
  deleteItemFromCollection: async ({
    collectionId,
    itemId,
  }: {
    collectionId: string;
    itemId: string;
  }) => {
    throw new Error(
      `cannot delete item ${itemId} from ${collectionId} - context not initialized`,
    );
  },
  deleteCollection: async ({ collectionId }: { collectionId: string }) => {
    throw new Error(
      `cannot delete collection ${collectionId} - context not initialized`,
    );
  },
  updateCollection: async ({
    collectionId,
    name,
    description,
  }: {
    collectionId: string;
    name: string;
    description: string;
  }) => {
    throw new Error(
      `cannot update collection ${collectionId} name: ${name} description:${description} - context not initialized`,
    );
  },
});

export const useCollection = () => useContext(CollectionContext);

export const CollectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: featuredCollections } = useFeaturedCollections();
  const { data: userCollections } = useUserCollections();
  const {
    mutateAsync: createCollection,
    isPending: createCollectionIsLoading,
  } = useCreateCollection();
  const {
    mutateAsync: createItemInCollection,
    isPending: createItemInCollectionIsLoading,
  } = useCreateItemInCollection();
  const {
    mutateAsync: deleteItemFromCollection,
    isPending: deleteItemFromCollectionIsLoading,
  } = useDeleteItemFromCollection();
  const {
    mutateAsync: deleteCollection,
    isPending: deleteCollectionIsLoading,
  } = useDeleteCollection();
  const {
    mutateAsync: updateCollection,
    isPending: updateCollectionIsLoading,
  } = useUpdateCollection();
  const isLoading: boolean =
    createCollectionIsLoading ||
    createItemInCollectionIsLoading ||
    deleteItemFromCollectionIsLoading ||
    deleteCollectionIsLoading ||
    updateCollectionIsLoading;
  const value = useMemo(() => {
    return {
      isLoading,
      featuredCollections: featuredCollections ?? [],
      userCollections: userCollections ?? [],
      createCollection,
      createItemInCollection,
      deleteItemFromCollection,
      deleteCollection,
      updateCollection,
    };
  }, [
    isLoading,
    featuredCollections,
    userCollections,
    createCollection,
    createItemInCollection,
    deleteItemFromCollection,
    deleteCollection,
    updateCollection,
  ]);
  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
};
