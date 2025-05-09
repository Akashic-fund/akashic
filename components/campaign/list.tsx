'use client';

import { Campaign } from '@/types/campaign';
import { useInfiniteCampaigns } from '@/lib/hooks/useCampaigns';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import { CampaignLoading } from '@/components/campaign/loading';
import { CampaignError } from '@/components/campaign/error';
import { CampaignItem } from '@/components/campaign/item';
import { CollectionAddDialog } from '@/components/collection/add-dialog';

interface CampaignListProps {
  searchTerm: string;
  categoryFilter?: string | null;
}

export function CampaignList({
  searchTerm,
  categoryFilter,
}: CampaignListProps) {
  const { ref, inView } = useInView();
  const {
    data,
    isLoading: loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCampaigns();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter campaigns based on search term and category
  const filteredCampaigns = data?.pages.map((page) => ({
    ...page,
    campaigns: page.campaigns.filter((campaign) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        campaign.title?.toLowerCase().includes(searchLower) ||
        campaign.description?.toLowerCase().includes(searchLower) ||
        campaign.location?.toLowerCase().includes(searchLower);

      // If a category filter is applied, check if the campaign matches
      const matchesCategory =
        !categoryFilter || campaign.category === categoryFilter;

      return matchesSearch && matchesCategory;
    }),
  }));

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  if (loading && !data) {
    return <CampaignLoading minimal={true} />;
  }

  if (error) {
    return <CampaignError error={error} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns?.map((page) =>
          page.campaigns.map((campaign: Campaign) => (
            <CampaignItem
              key={campaign.id}
              campaign={campaign}
              onSelect={() => {
                setSelectedCampaign(campaign);
              }}
            />
          )),
        )}
      </div>
      {selectedCampaign ? (
        <CollectionAddDialog
          campaign={selectedCampaign}
          onClosed={() => {
            setSelectedCampaign(null);
          }}
        />
      ) : null}
      {/* Loading indicator */}
      {isFetchingNextPage && <CampaignLoading minimal={true} />}

      {/* Intersection observer target */}
      <div ref={ref} className="h-10" />
    </div>
  );
}
