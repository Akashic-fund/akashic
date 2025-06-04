'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts';
import { type Address } from 'viem';
// import { ReviewRecipients } from "@/components/review-recipients"
import { ApplicationStatus } from '@/lib/qfInteractions';
// import { RecipientStatus } from '@/.generated/prisma/client'

interface Campaign {
  id: number;
  title: string;
  slug: string;
  walletAddress: string;
  treasuryAddress: string;
  creatorAddress: string;
}

interface Recipient {
  id: number;
  walletAddress: string;
  campaignId: number;
  campaign: {
    id: number;
    title: string;
  };
  status: ApplicationStatus;
}

interface CheckWalletServerProps {
  poolId: bigint;
  roundId: number;
  strategyAddress: Address;
  roundAdminAddress: Address;
  roundStatusKey: string;
}

export function CheckWalletServer({
  poolId,
  roundId,
  strategyAddress,
  roundAdminAddress,
  // roundStatusKey
}: CheckWalletServerProps) {
  const { authenticated, address } = useAuth();
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [pendingRecipients, setPendingRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log({
    poolId,
    roundId,
    strategyAddress,
    pendingRecipients,
  });

  const isAdmin = authenticated && address === roundAdminAddress;
  console.log('userCampaigns', userCampaigns);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      if (authenticated) {
        // Load user campaigns if the wallet is connected
        try {
          const response = await fetch(`/api/campaigns/user`);
          const data = await response.json();

          if (data.campaigns && Array.isArray(data.campaigns)) {
            // Map the response to match our expected Campaign interface
            const mappedCampaigns = data.campaigns.map(
              (campaign: Campaign) => ({
                id: campaign.id,
                title: campaign.title,
                slug: campaign.slug || '',
                walletAddress:
                  campaign.treasuryAddress || campaign.creatorAddress || '',
              }),
            );

            setUserCampaigns(mappedCampaigns);

            // If user is admin, load pending recipients
            if (isAdmin) {
              const recipientsResponse = await fetch(
                `/api/rounds/recipients/pending/${roundId}`,
              );
              const recipientsData = await recipientsResponse.json();

              if (recipientsData.success) {
                setPendingRecipients(recipientsData.recipients);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load user data', error);
        }
      } else {
        // Reset state if wallet disconnected
        setUserCampaigns([]);
        setPendingRecipients([]);
      }

      setIsLoading(false);
    }

    loadData();
  }, [address, authenticated, isAdmin, roundId]);

  if (isLoading) return null;

  return (
    <>
      {/* {isConnected && userCampaigns.length > 0 && (
                <RegisterCampaignRecipient
                    campaignId={userCampaigns[0].id}
                    campaignTitle={userCampaigns[0].title}
                    campaignWalletAddress={userCampaigns[0].walletAddress as Address}
                    poolId={poolId}
                    roundId={roundId}
                    disabled={roundStatusKey !== "APPLICATION_OPEN"}
                    buttonVariant="outline"
                    buttonText="Register for QF"
                />
            )} */}

      {/* {isAdmin && pendingRecipients.length > 0 && (
                <ReviewRecipients
                    strategyAddress={strategyAddress}
                    poolId={poolId}
                    roundId={roundId}
                    recipients={pendingRecipients.map(r => ({
                        id: r.id,
                        address: r.walletAddress as Address,
                        campaignId: r.campaignId,
                        campaignName: r.campaign.title,
                        currentStatus: r.status as unknown as ApplicationStatus
                    }))}
                    isAdmin={isAdmin}
                />
            )} */}
    </>
  );
}
