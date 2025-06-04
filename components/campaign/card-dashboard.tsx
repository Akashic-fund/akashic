import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Campaign } from '@/types/campaign';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/favorite-button';
import { categories } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';

interface CampaignCardDashboardProps {
  campaign: Campaign;
  isFavorite?: boolean;
  onFavoriteToggle?: (isFavorite: boolean) => void;
}

export function CampaignCardDashboard({
  campaign,
  isFavorite,
  onFavoriteToggle,
}: CampaignCardDashboardProps) {
  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleDateString();
  };

  const getCampaignStatus = (campaign: Campaign) => {
    if (campaign.status === 'DRAFT') return 'Draft';
    if (campaign.status === 'PENDING_APPROVAL') return 'Pending Approval';
    if (campaign.status === 'FAILED') return 'Failed';
    if (campaign.status === 'COMPLETED') return 'Completed';

    const now = Math.floor(Date.now() / 1000);
    const launchTime = campaign.launchTime
      ? parseInt(campaign.launchTime)
      : now;
    const deadline = campaign.deadline ? parseInt(campaign.deadline) : now;

    if (now < launchTime) return 'Upcoming';
    if (now > deadline) return 'Ended';
    return 'Active';
  };

  // Find the category details
  const categoryDetails = campaign.category
    ? categories.find((cat) => cat.id === campaign.category)
    : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative p-0">
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
        <div className="absolute right-4 top-4 z-10">
          <FavoriteButton
            campaignId={campaign.id}
            initialIsFavorite={isFavorite}
            onToggle={onFavoriteToggle}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold"></h2>
            {categoryDetails && (
              <Badge variant="outline" className="ml-2 flex items-center gap-1">
                <span>{categoryDetails.icon}</span>
                <span className="text-xs">{categoryDetails.name}</span>
              </Badge>
            )}
          </div>
          <div
            className={cn('rounded-full px-3 py-1 text-sm', {
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
          <p className="line-clamp-3">
            <strong>Description:</strong> {campaign.description}
          </p>
          {campaign.treasuryAddress && (
            <p>
              <strong>Treasury:</strong> {campaign.treasuryAddress}
            </p>
          )}
          {campaign.launchTime && (
            <p>
              <strong>Launch:</strong> {formatDate(campaign.launchTime)}
            </p>
          )}
          {campaign.deadline && (
            <p>
              <strong>Deadline:</strong> {formatDate(campaign.deadline)}
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
          {campaign.totalRaised && campaign.goalAmount && (
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
                  (Number(campaign.totalRaised) / Number(campaign.goalAmount)) *
                  100
                }
                className="h-2"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
