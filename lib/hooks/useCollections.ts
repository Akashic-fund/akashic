import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Collection } from '@/types';
import { QueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts';

const COLLECTIONS_QUERY_KEY = 'collections';
const FEATURED_COLLECTIONS_QUERY_KEY = 'featured_collections';

async function fetchFeaturedCollections() {
  const url = `/api/collections/featured`;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch featured collections');
  }
  const data = await response.json();
  return data.collections ?? [];
}

async function fetchCollection(collectionId: string): Promise<Collection> {
  const response = await fetch(`/api/collections/${collectionId}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user collection');
  }
  const data = await response.json();
  return data.collection;
}
async function fetchUserCollections(): Promise<Collection[]> {
  const response = await fetch(`/api/collections`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user collections');
  }
  const data = await response.json();
  return data.collections ?? [];
}

export function useFeaturedCollections() {
  return useQuery({
    queryKey: [FEATURED_COLLECTIONS_QUERY_KEY],
    queryFn: () => fetchFeaturedCollections(),
    enabled: true,
  });
}

export function useUserCollections() {
  const { authenticated } = useAuth();

  return useQuery({
    queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
    queryFn: fetchUserCollections,
    enabled: authenticated,
  });
}
export function useCollection(collectionId: string) {
  const { authenticated } = useAuth();
  return useQuery({
    queryKey: [COLLECTIONS_QUERY_KEY, collectionId],
    queryFn: () => fetchCollection(collectionId!),
    enabled: authenticated,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create collection');
      }

      const data = await response.json();
      return data?.collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
      });
    },
  });
}
export function useCreateItemInCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      itemId,
      itemType,
    }: {
      collectionId: string;
      itemId: string;
      itemType: string;
    }) => {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
          itemType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create collection item');
      }
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, collectionId],
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
      });
    },
  });
}
export function useDeleteItemFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      itemId,
    }: {
      collectionId: string;
      itemId: string;
    }) => {
      const response = await fetch(`/api/collections/${collectionId}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete item from collection');
      }
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, collectionId],
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
      });
    },
  });
}
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ collectionId }: { collectionId: string }) => {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete collection');
      }
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, collectionId],
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
      });
      queryClient.invalidateQueries({
        queryKey: [FEATURED_COLLECTIONS_QUERY_KEY],
      });
    },
  });
}
// Prefetching function
export async function prefetchFeaturedCollections(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: [FEATURED_COLLECTIONS_QUERY_KEY],
    queryFn: fetchFeaturedCollections,
  });
}
export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      name,
      description,
    }: {
      collectionId: string;
      name: string;
      description: string;
    }) => {
      const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update collection');
      }
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, collectionId],
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [COLLECTIONS_QUERY_KEY, 'user'],
      });
    },
  });
}
