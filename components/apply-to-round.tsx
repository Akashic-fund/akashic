'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts';
import { type Address } from 'viem';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { applyCampaignToRound } from '@/lib/actions/campaign-actions';
import type { RoundStatusKey } from '@/types/round';
import { RegisterCampaignRecipient } from '@/components/register-campaign-recipient';

interface Campaign {
  id: number;
  title: string;
  slug: string;
  walletAddress: string;
}

interface ApplyToRoundProps {
  roundId: number;
  roundTitle: string;
  applicationEndDate: Date;
  poolId?: string;
  strategyAddress?: Address;
  roundStatusKey: RoundStatusKey;
}

const APPLY_ELIGIBLE_STATUSES: RoundStatusKey[] = ['APPLICATION_OPEN'];
// const VIEW_ONLY_STATUSES: RoundStatusKey[] = [
//   "NOT_STARTED",
//   "APPLICATION_CLOSED",
//   "ACTIVE",
//   "ENDED",
//   "UNKNOWN",
// ];

export function ApplyToRound({
  roundId,
  roundTitle,
  applicationEndDate,
  poolId,
  // strategyAddress,
  roundStatusKey,
}: ApplyToRoundProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { address, authenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCampaigns, setUserCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null,
  );
  const [showQfRegistration, setShowQfRegistration] = useState(false);

  const canApply = APPLY_ELIGIBLE_STATUSES.includes(roundStatusKey);
  const isApplicationPeriodOver = !canApply;

  async function handleOpenDialog() {
    if (!authenticated) {
      toast({
        title: 'Connect wallet',
        description: 'Please connect your wallet to apply to this round',
        variant: 'destructive',
      });
      return;
    }

    setIsOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/campaigns/user`);
      const data = await response.json();

      if (data.campaigns && Array.isArray(data.campaigns)) {
        const mappedCampaigns = data.campaigns.map((campaign: Campaign) => ({
          id: campaign.id,
          title: campaign.title,
          slug: campaign.slug || '',
          walletAddress: campaign.walletAddress || address || '',
        }));

        setUserCampaigns(mappedCampaigns);
      } else {
        toast({
          title: 'Error loading campaigns',
          description: data.error || 'Failed to load your campaigns',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      toast({
        title: 'Error loading campaigns',
        description: 'Failed to load your campaigns',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleCampaignSelect(campaignId: number) {
    setSelectedCampaignId(campaignId);
  }

  function handleSubmit() {
    if (!selectedCampaignId) {
      toast({
        title: 'Select a campaign',
        description: 'Please select a campaign to continue',
        variant: 'destructive',
      });
      return;
    }

    if (poolId && BigInt(poolId) > 0n) {
      setShowQfRegistration(true);
    } else {
      submitRegularApplication();
    }
  }

  async function submitRegularApplication() {
    setIsLoading(true);

    try {
      const result = await applyCampaignToRound({
        roundId,
        campaignId: parseInt(selectedCampaignId?.toString() || '0', 10),
      });

      if (result.success) {
        toast({
          title: `Successfully applied campaign to round ${roundTitle}.`,
          variant: 'default',
        });
        setIsOpen(false);
        setSelectedCampaignId(null);
        router.refresh();
      } else {
        toast({
          title: result?.error ?? 'Failed to apply campaign to round.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error applying campaign to round:', error);
      toast({
        title: 'An error occurred while applying to the round.',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleQfRegistrationComplete() {
    setShowQfRegistration(false);
    setIsOpen(false);
    router.refresh();
  }

  const selectedCampaign = userCampaigns.find(
    (c) => c.id === selectedCampaignId,
  );

  const buttonText = canApply
    ? 'Apply Your Project'
    : 'View Application Details';

  return (
    <>
      <Button
        variant="default"
        size="lg"
        onClick={handleOpenDialog}
        disabled={!canApply && isApplicationPeriodOver}
      >
        {buttonText}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply to {roundTitle}</DialogTitle>
            <DialogDescription>
              {canApply
                ? `Select one of your eligible campaigns to apply to this round. Applications close on ${applicationEndDate.toLocaleDateString()}.`
                : `Applications for this round closed on ${applicationEndDate.toLocaleDateString()}. You can no longer apply.`}
            </DialogDescription>
          </DialogHeader>

          {showQfRegistration && selectedCampaign && poolId ? (
            <RegisterCampaignRecipient
              campaignId={selectedCampaign.id}
              campaignTitle={selectedCampaign.title}
              campaignWalletAddress={selectedCampaign.walletAddress as Address}
              poolId={BigInt(poolId)}
              roundId={roundId}
              onComplete={handleQfRegistrationComplete}
              showDialog={false}
            />
          ) : (
            <>
              <div className="py-4">
                {isLoading ? (
                  <div className="py-4 text-center">
                    Loading your campaigns...
                  </div>
                ) : userCampaigns.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="mb-2">
                      You don&apos;t have any campaigns yet.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/campaigns/create')}
                    >
                      Create a Campaign
                    </Button>
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedCampaignId?.toString()}
                    onValueChange={(value) =>
                      handleCampaignSelect(parseInt(value, 10))
                    }
                  >
                    {userCampaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className="mb-3 flex items-center space-x-2 rounded border p-2 hover:bg-accent"
                      >
                        <RadioGroupItem
                          value={campaign.id.toString()}
                          id={`campaign-${campaign.id}`}
                        />
                        <Label
                          htmlFor={`campaign-${campaign.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          {campaign.title}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !selectedCampaignId}
                >
                  Apply Selected Campaign
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
