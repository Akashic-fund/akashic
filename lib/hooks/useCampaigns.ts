import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import type { Campaign } from '@/types/campaign';
import { QueryClient } from '@tanstack/react-query';

const CAMPAIGNS_QUERY_KEY = 'campaigns';

interface PaginatedResponse {
  campaigns: Campaign[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

async function fetchCampaigns(status?: string) {
  const url = status ? `/api/campaigns?status=${status}` : '/api/campaigns';
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaigns');
  }
  const data = await response.json();
  return data.campaigns;
}

async function fetchCampaignPage({
  pageParam = 1,
  status = 'active',
  pageSize = 10,
}) {
  const url = `/api/campaigns?status=${status}&page=${pageParam}&pageSize=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaigns');
  }
  return (await response.json()) as PaginatedResponse;
}

async function fetchUserCampaigns(address: string): Promise<Campaign[]> {
  const response = await fetch(`/api/campaigns/user?address=${address}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user campaigns');
  }
  const data = await response.json();
  return data.campaigns;
}

export function useCampaigns(status?: string) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, status],
    queryFn: () => fetchCampaigns(status),
    enabled: true,
  });
}

export function useInfiniteCampaigns(status = 'active', pageSize = 10) {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'infinite', status, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchCampaignPage({ pageParam: pageParam as number, status, pageSize }),
    getNextPageParam: (lastPage: PaginatedResponse) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage: PaginatedResponse) =>
      firstPage.pagination.currentPage > 1
        ? firstPage.pagination.currentPage - 1
        : undefined,
    initialPageParam: 1,
  });
}

export function useUserCampaigns(address?: string | null) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'user', address],
    queryFn: () => fetchUserCampaigns(address!),
    enabled: !!address,
  });
}
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      status,
      transactionHash,
      campaignAddress,
    }: {
      campaignId: string;
      status?: string;
      transactionHash?: string;
      campaignAddress?: string;
    }) => {
      const response = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          status,
          transactionHash,
          campaignAddress,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update campaign');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}

// Prefetching function
export async function prefetchCampaigns(
  queryClient: QueryClient,
  status?: string,
) {
  await queryClient.prefetchQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, status],
    queryFn: () => fetchCampaigns(status),
  });
}
