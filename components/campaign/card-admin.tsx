import { useCallback, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Progress, Button } from '@/components/ui';
import { MapPin, Copy } from 'lucide-react';
import { type Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { FormattedDate } from '@/components/formatted-date';
import { useToast } from '@/hooks/use-toast';
interface CampaignCardDashboardProps {
  campaign: Campaign;
  onApprove: (campaignId: number, campaignAddress: string) => Promise<void>;
}
const getCampaignStatus = (campaign: Campaign) => {
  const now = Math.floor(Date.now() / 1000);
  if (campaign.status === 'DRAFT') {
    return 'Draft';
  } else if (campaign.status === 'PENDING_APPROVAL') {
    return 'Pending Approval';
  } else if (campaign.status === 'FAILED') {
    return 'Failed';
  } else if (campaign.status === 'COMPLETED') {
    return 'Completed';
  }
  const launchTime = campaign.launchTime ? parseInt(campaign.launchTime) : now;
  const deadline = campaign.deadline ? parseInt(campaign.deadline) : now;
  if (now < launchTime) {
    return 'Upcoming';
  } else if (now > deadline) {
    return 'Ended';
  }
  return 'Active';
};
export function CampaignCardAdmin({
  campaign,
  onApprove,
}: CampaignCardDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const onApproveIntern = useCallback(async () => {
    setIsLoading(true);
    await onApprove(campaign.id, campaign.address || '');
  }, [onApprove, campaign.id, campaign.address]);
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Image
          src={
            campaign.images?.find((img) => img.isMainImage)?.imageUrl ||
            '/images/placeholder.svg'
          }
          alt={campaign.title || 'Campaign'}
          width={600}
          height={400}
          className="h-[200px] w-full object-cover"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="mb-4 text-xl font-bold">
            {campaign.title || 'Campaign'}
          </h2>
          <div
            className={cn('inline-block rounded-full px-3 py-1 text-sm', {
              'bg-blue-100 text-blue-600':
                getCampaignStatus(campaign) === 'Active',
              'bg-yellow-100 text-yellow-600':
                getCampaignStatus(campaign) === 'Upcoming',
              'bg-gray-100 text-gray-600':
                getCampaignStatus(campaign) === 'Ended',
              'bg-orange-100 text-orange-600':
                getCampaignStatus(campaign) === 'Pending Approval',
              'bg-purple-100 text-purple-600':
                getCampaignStatus(campaign) === 'Draft',
              'bg-red-100 text-red-600':
                getCampaignStatus(campaign) === 'Failed',
              'bg-green-100 text-green-600':
                getCampaignStatus(campaign) === 'Completed',
            })}
          >
            {getCampaignStatus(campaign)}
          </div>
        </div>

        <div className="space-y-2">
          <p>
            <strong>Description:</strong> {campaign.description}
          </p>
          <div className="flex items-center gap-2">
            <strong>Creator:</strong>
            <span className="font-mono">
              {campaign.owner?.slice(0, 8)}...
              {campaign.owner?.slice(-8)}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(campaign.owner || '');
                toast({
                  title: 'Address copied',
                  description: 'The address has been copied to your clipboard',
                });
              }}
              className="rounded-full p-1 transition-colors hover:bg-gray-100"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {campaign.location && (
            <div className="flex items-center gap-1">
              <MapPin className="text-[#55DFAB]" />
              <p>{campaign.location}</p>
            </div>
          )}
          {campaign.launchTime && (
            <p>
              <strong>Launch:</strong>{' '}
              <FormattedDate timestamp={campaign.launchTime} />
            </p>
          )}
          {campaign.deadline && (
            <p>
              <strong>Deadline:</strong>{' '}
              <FormattedDate timestamp={campaign.deadline} />
            </p>
          )}
          <p>
            <strong>Goal:</strong> {campaign.goalAmount || campaign.fundingGoal}{' '}
            USDC
          </p>
          {campaign.totalRaised && (
            <p>
              <strong>Raised:</strong> {campaign.totalRaised} USDC
            </p>
          )}

          {campaign.status === 'PENDING_APPROVAL' && (
            <Button
              onClick={onApproveIntern}
              className="mt-4 w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Approve Campaign'}
            </Button>
          )}

          {typeof campaign.totalRaised === 'string' &&
            typeof campaign.goalAmount === 'string' && (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span>Progress</span>
                  <span>
                    {(
                      (Number(campaign.totalRaised) /
                        Number(campaign.goalAmount)) *
                      100
                    ).toFixed(2)}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    (Number(campaign.totalRaised) /
                      Number(campaign.goalAmount)) *
                    100
                  }
                  className="h-2"
                />
              </div>
            )}

          {/* Display associated rounds */}
          {campaign.rounds && campaign.rounds.length > 0 && (
            <div className="mt-4">
              <h4 className="font-bold">Rounds this campaign is part of:</h4>
              <ul className="list-disc pl-5">
                {campaign.rounds.map((round) => (
                  <li key={round.id}>{round.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
