import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const UPDATES_QUERY_KEY = 'campaign-updates';

async function fetchCampaignUpdates(campaignId: string) {
  const response = await fetch(`/api/campaigns/${campaignId}/updates`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch campaign updates');
  }
  const data = await response.json();
  return data;
}

async function createCampaignUpdate({
  campaignId,
  content,
}: {
  campaignId: string;
  content: string;
}) {
  const response = await fetch(`/api/campaigns/${campaignId}/updates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create campaign update');
  }
  return response.json();
}

export function useCampaignUpdates(campaignId: string) {
  return useQuery({
    queryKey: [UPDATES_QUERY_KEY, campaignId],
    queryFn: () => fetchCampaignUpdates(campaignId),
    enabled: !!campaignId,
  });
}

export function useCreateCampaignUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaignUpdate,
    onSuccess: (_, variables) => {
      // Invalidate and refetch updates for this campaign
      queryClient.invalidateQueries({
        queryKey: [UPDATES_QUERY_KEY, variables.campaignId],
      });
    },
  });
}
