'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

import { AdminAccessDenied } from '@/components/admin/access-denied';
import { AdminLoading } from '@/components/admin/loading';
import { useAdminApproveCampaign as useAdminApproveWeb3Campaign } from '@/lib/web3/hooks/useAdminApproveCampaign';
import { useAdminApproveCampaign } from '@/lib/hooks/useCampaigns';
import { enableBypassContractAdmin } from '@/lib/develop';
import { useInfiniteCampaigns } from '@/lib/hooks/useCampaigns';
import { useInView } from 'react-intersection-observer';
import { CampaignCardAdmin } from '@/components/campaign/card-admin';
import { CampaignLoading } from '@/components/campaign/loading';
import { type Campaign } from '@/types/campaign';
import { DashboardOverview } from '@/components/dashboard/overview';

export default function AdminPage() {
  const { isAdmin, isReady } = useAuth();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const { adminApproveCampaign: adminApproveWeb3Campaign } =
    useAdminApproveWeb3Campaign();

  const { mutateAsync: adminApproveCampaign } = useAdminApproveCampaign();
  /* TODO: Implement rounds functionality
   * - Add state management for rounds
   * - Add state for selected rounds
   * - Add state for dropdown visibility
   */
  // const [rounds, setRounds] = useState<{ id: number; title: string }[]>([]);
  // const [selectedRounds, setSelectedRounds] = useState<number[]>([]);
  // const [dropdownStates, setDropdownStates] = useState<{ [key: number]: boolean }>({});

  const { ref, inView } = useInView();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCampaigns('all', 10, true);
  const filteredCampaignPages = useMemo(() => {
    return data?.pages;
  }, [data]);
  const approveCampaign = useCallback(
    async (campaignId: number, campaignAddress: string) => {
      try {
        const treasuryAddress = enableBypassContractAdmin
          ? 'mock-treasury-address'
          : await adminApproveWeb3Campaign(campaignId, campaignAddress);
        await adminApproveCampaign({ campaignId, treasuryAddress });

        toast({
          title: 'Success',
          description: 'Campaign has been approved successfully',
        });
      } catch (err) {
        console.error('Error approving campaign:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to approve campaign',
        );
        toast({
          title: 'Error',
          description:
            err instanceof Error ? err.message : 'Failed to approve campaign',
          variant: 'destructive',
        });
      }
    },
    [toast, adminApproveCampaign, adminApproveWeb3Campaign],
  );
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* TODO: Implement campaign round association functionality
   * - Add API endpoint for campaign-round association
   * - Implement error handling and validation
   * - Add success/error notifications
   * - Handle state updates after successful association
   */
  // const addCampaignToRounds = async (campaignId: number) => {
  //   try {
  //     const response = await fetch(`/api/campaigns/round`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         campaignId,
  //         roundIds: selectedRounds,
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error("Failed to add campaign to rounds");
  //     }
  //     toast({
  //       title: "Success",
  //       description: "Campaign added to selected rounds successfully.",
  //     });
  //     setSelectedRounds([]); // Clear selection after successful submission
  //     toggleDropdown(campaignId); // Close dropdown
  //   } catch (err) {
  //     console.error("Error adding campaign to rounds:", err);
  //     setError(err instanceof Error ? err.message : "An error occurred");
  //   }
  // };

  /* TODO: Implement dropdown toggle functionality
   * - Add state management for dropdown visibility
   * - Implement toggle logic for each campaign
   * - Add keyboard accessibility
   * - Consider adding animation for smooth transitions
   */
  // const toggleDropdown = (campaignId: number) => {
  //   setDropdownStates((prev) => ({
  //     ...prev,
  //     [campaignId]: !prev[campaignId],
  //   }));
  // };

  if (!isReady) {
    return <AdminLoading />;
  }
  // Show access denied if not admin
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button onClick={() => setError(null)}>Reset</Button>
        </AlertDescription>
      </Alert>
    );
  }
  if (isLoading && !data) {
    return <CampaignLoading minimal={true} />;
  }
  // Main content
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50">
      <div className="mx-auto max-w-7xl p-5">
        <div className="mb-8 pt-5 text-3xl font-bold">Admin Dashboard</div>

        {filteredCampaignPages?.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No campaigns found.</p>
          </div>
        ) : (
          <>
            <DashboardOverview
              campaigns={[] /* TODO: api for global stats */}
            />
            {/* Campaign Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaignPages?.map((page) =>
                page.campaigns.map((campaign: Campaign) => (
                  <CampaignCardAdmin
                    campaign={campaign}
                    key={campaign.id}
                    onApprove={approveCampaign}
                  />
                )),
              )}
            </div>
            {isFetchingNextPage && <CampaignLoading minimal={true} />}
            <div ref={ref} className="h-10" />
          </>
        )}
      </div>
    </div>
  );
}
