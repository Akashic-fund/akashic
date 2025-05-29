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

async function fetchUserCampaigns(address: string): Promise<Campaign[]> {
  const response = await fetch(`/api/campaigns/user?address=${address}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user campaigns');
  }
  const data = await response.json();
  return data.campaigns;
}
interface IUpdateCampaignHook {
  userAddress: string | undefined;
}
interface IUpdateCampaign {
  campaignId: number;
  status?: string;
  transactionHash?: string;
  campaignAddress?: string;
}
interface IUpdateCampaignApi extends IUpdateCampaign {
  userAddress: string;
}
async function updateCampaign({
  campaignId,
  status,
  transactionHash,
  campaignAddress,
  userAddress,
}: IUpdateCampaignApi) {
  const response = await fetch('/api/campaigns', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      campaignId,
      status,
      transactionHash,
      campaignAddress,
      userAddress,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update campaign');
  }

  return response.json();
}
interface ICreateCampaignHook {
  userAddress?: string;
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
interface ICreateCampaignApi extends ICreateCampaign {
  address: string;
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
  address,
  bannerImage,
}: ICreateCampaignApi) {
  const formDataToSend = new FormData();
  formDataToSend.append('title', title);
  formDataToSend.append('description', description);
  formDataToSend.append('fundingGoal', fundingGoal);
  formDataToSend.append('startTime', startTime);
  formDataToSend.append('endTime', endTime);
  formDataToSend.append('creatorAddress', address);
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
interface IApproveCampaignHook {
  adminAddress?: string | null;
}
interface IApproveCampaign {
  campaignId: number;
  treasuryAddress: string;
}
interface IApproveCampaignApi extends IApproveCampaign {
  adminAddress: string;
}
async function approveCampaign({
  campaignId,
  treasuryAddress,
  adminAddress,
}: IApproveCampaignApi) {
  const response = await fetch(`/api/campaigns/${campaignId}/approve`, {
    method: 'POST',
    body: JSON.stringify({
      treasuryAddress,
      adminAddress,
      status: 'active',
    }),
  });
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

export function useUserCampaigns(address?: string | null) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, 'user', address],
    queryFn: () => fetchUserCampaigns(address!),
    enabled: !!address,
  });
}
export function useUpdateCampaign({ userAddress }: IUpdateCampaignHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: IUpdateCampaign) => {
      if (!userAddress) {
        throw new Error('Cannot update Campaign without a wallet address');
      }
      return updateCampaign({ ...variables, userAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}
export function useCreateCampaign({ userAddress }: ICreateCampaignHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ICreateCampaign) => {
      if (!userAddress) {
        throw new Error('Cannot create Campaign without a wallet address');
      }
      return createCampaign({ ...variables, address: userAddress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
  });
}
export function useAdminApproveCampaign({
  adminAddress,
}: IApproveCampaignHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: IApproveCampaign) => {
      if (!adminAddress) {
        throw new Error('Cannot approve Campaign without a wallet address');
      }
      return approveCampaign({ ...variables, adminAddress });
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
