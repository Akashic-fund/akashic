import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Favourite } from '@/types';

const FAVOURITE_QUERY_KEY = 'favourite';
const FAVOURITE_CHECK_QUERY_KEY = 'favourite_check';

async function fetchUserFavourites(address: string): Promise<Favourite[]> {
  const response = await fetch(`/api/favorites/user?userAddress=${address}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user favourites');
  }
  const data = await response.json();
  return data.favorites;
}
async function checkUserFavourite(
  address: string,
  campaignId: number,
): Promise<boolean> {
  const response = await fetch(
    `/api/favorites?userAddress=${address}&campaignId=${campaignId}`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user favourites');
  }
  const data = await response.json();
  return data.isFavorite ?? false;
}

export function useUserFavourites(address?: string | null) {
  return useQuery({
    queryKey: [FAVOURITE_QUERY_KEY, 'user', address],
    queryFn: () => fetchUserFavourites(address!),
    enabled: !!address,
  });
}
export function useCheckUserFavourite(
  address?: string | null,
  campaignId?: number | null,
) {
  return useQuery({
    queryKey: [FAVOURITE_CHECK_QUERY_KEY, 'user', address],
    queryFn: () => checkUserFavourite(address!, campaignId!),
    enabled: !!address,
  });
}

export function useUpdateFavourite(userAddress?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId }: { campaignId: number }) => {
      if (!userAddress) {
        throw new Error('Failed to update favourite');
      }
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          userAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update favourite');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FAVOURITE_QUERY_KEY, FAVOURITE_CHECK_QUERY_KEY],
      });
    },
  });
}
