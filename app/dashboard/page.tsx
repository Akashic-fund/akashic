'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';
import { DashboardOverview } from '@/components/dashboard/overview';
import { Campaign } from '@/types/campaign';
import { Favourite } from '@/types';
import { CampaignCard } from '@/components/campaign/card';
import { CampaignLoading } from '@/components/campaign/loading';
import { CampaignError } from '@/components/campaign/error';
import { CampaignEmpty } from '@/components/campaign/empty';
import { useUserCampaigns } from '@/lib/hooks/useCampaigns';
import { useUserFavourites } from '@/lib/hooks/useFavourites';
import { DashboardNotAuthenticated } from '@/components/dashboard/not-authenticated';
import { PageDashboard } from '@/components/page/dashboard';

export default function DashboardPage() {
  const { address, authenticated } = useAuth();
  const {
    data: campaigns,
    isLoading: loading,
    error,
  } = useUserCampaigns(address);
  const {
    data: favourites,
    isLoading: loadingFavourites,
    error: favouriteError,
  } = useUserFavourites(address);

  if (!authenticated && !address) {
    return (
      <PageDashboard>
        <DashboardOverview />
        <DashboardNotAuthenticated />
      </PageDashboard>
    );
  }

  if (loading || loadingFavourites) {
    return (
      <PageDashboard>
        <DashboardOverview />
        <Tabs defaultValue="my-campaigns" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="my-campaigns" className="px-4 py-2">
              My Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-campaigns">
            <CampaignLoading />
          </TabsContent>
        </Tabs>
      </PageDashboard>
    );
  }

  return (
    <PageDashboard>
      {!error && <DashboardOverview campaigns={campaigns} />}

      <Tabs defaultValue="my-campaigns" className="mt-8">
        <TabsList className="mb-6">
          <TabsTrigger value="my-campaigns" className="px-4 py-2">
            My Campaigns
          </TabsTrigger>
          <TabsTrigger value="favorites" className="px-4 py-2">
            <Heart className="mr-2 h-4 w-4" />
            My Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-campaigns">
          {loading ? (
            <CampaignLoading />
          ) : error ? (
            <CampaignError error={error.message} />
          ) : campaigns?.length === 0 ? (
            <CampaignEmpty />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns?.map((campaign: Campaign) => (
                <CampaignCard key={campaign.address} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites">
          {loadingFavourites ? (
            <CampaignLoading />
          ) : favouriteError ? (
            <CampaignError error={favouriteError.message} />
          ) : favourites?.length === 0 ? (
            <CampaignEmpty message="You haven't saved any campaigns as favorites yet." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favourites?.map((favourite: Favourite) => (
                <CampaignCard
                  key={`favorite-${favourite.campaign.id}`}
                  campaign={favourite.campaign}
                  isFavorite={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageDashboard>
  );
}
