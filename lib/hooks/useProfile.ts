import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const PROFILE_QUERY_KEY = 'profile';

interface IUpdateUserProfileApi {
  userAddress: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  recipientWallet?: string;
}
interface IUserProfileApi {
  id: number;
  address: string;
  recipientWallet: string;
  crowdsplitCustomerId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isKycCompleted: boolean;
  username: string;
  bio: string;
}

async function updateUserProfile(
  variables: IUpdateUserProfileApi,
): Promise<IUpdateUserProfileApi> {
  const response = await fetch(`/api/users/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user profile');
  }
  const data = await response.json();
  return data.user;
}
async function fetchUserProfile(address: string): Promise<IUserProfileApi> {
  const response = await fetch(`/api/users/me?userAddress=${address}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user profile');
  }
  const data = await response.json();
  return data;
}

export function useUserProfile(address?: string | null) {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: () => fetchUserProfile(address!),
    enabled: !!address,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });
}
