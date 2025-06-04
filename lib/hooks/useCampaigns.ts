import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useAuth } from '@/contexts';
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
async function fetchCampaign(slug?: string) {
  const url = `/api/campaigns/${slug}`;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaign');
  }
  const data = await response.json();
  return data.campaign;
}

async function fetchCampaignPage({
  pageParam = 1,
  status = 'active',
  rounds = false,
  pageSize = 10,
}) {
  const url = `/api/campaigns?status=${status}&page=${pageParam}&pageSize=${pageSize}&rounds=${rounds}`;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaigns');
  }
  return (await response.json()) as PaginatedResponse;
}

async function fetchUserCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`/api/campaigns/user`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user campaigns');
  }
  const data = await response.json();
  return data.campaigns;
}
interface IUpdateCampaign {
  campaignId: number;
  status?: string;
  transactionHash?: string;
  campaignAddress?: string;
}
async function updateCampaign(variables: IUpdateCampaign) {
  const response = await fetch('/api/campaigns', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update campaign');
  }

  return response.json();
}
interface ICreateCampaign {
  title: string;
  description: string;
  fundingGoal: string;
  startTime: string;
  endTime: string;
  status?: string;
  location: string;
  category: string;
  bannerImage?: File;
}
async function createCampaign({
  title,
  description,
  fundingGoal,
  startTime,
  endTime,
  status = 'draft',
  location,
  category,
  bannerImage,
}: ICreateCampaign) {
  const formDataToSend = new FormData();
  formDataToSend.append('title', title);
  formDataToSend.append('description', description);
  formDataToSend.append('fundingGoal', fundingGoal);
  formDataToSend.append('startTime', startTime);
  formDataToSend.append('endTime', endTime);
  formDataToSend.append('status', status);
  formDataToSend.append('location', location);
  formDataToSend.append('category', category);
  if (bannerImage) {
    formDataToSend.append('bannerImage', bannerImage);
  }
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    body: formDataToSend,
  });
  if (!response.ok) {
    let errorMsg = 'Failed to save campaign';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.error
        ? `${errorData.error}${errorData.details ? ': ' + errorData.details : ''}`
        : errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}
interface IApproveCampaign {
  campaignId: number;
  treasuryAddress: string;
}
async function approveCampaign(variables: IApproveCampaign) {
  const response = await fetch(
    `/api/campaigns/${variables.campaignId}/approve`,
    {
      method: 'POST',
      body: JSON.stringify(variables),
    },
  );
  if (!response.ok) {
    let errorMsg = 'Failed to approve campaign';
    try {
      const errorData = await response.json();
      errorMsg = errorData?.error
        ? `${errorData.error}${errorData.details ? ': ' + errorData.details : ''}`
        : errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export function useCampaigns(status?: string) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, status],
    queryFn: () => fetchCampaigns(status),
    enabled: true,
  });
}
export function useCampaign(slug?: string) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, slug],
    queryFn: () => fetchCampaign(slug),
    enabled: true,
  });
}

export function useInfiniteCampaigns(
  status = 'active',
  pageSize = 10,
  rounds = false,
) {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'infinite', status, pageSize],
    queryFn: ({ pageParam = 1 }) =>
      fetchCampaignPage({
        pageParam: pageParam as number,
        status,
        pageSize,
        rounds,
      }),
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

export function useUserCampaigns() {
  const { authenticated } = useAuth();
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'user'],
    queryFn: fetchUserCampaigns,
    enabled: authenticated,
  });
}
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}
export function useAdminApproveCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveCampaign,
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
