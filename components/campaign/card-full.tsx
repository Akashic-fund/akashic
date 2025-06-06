import { useMemo } from 'react';
import { CampaignDisplay } from '@/types/campaign';
import Link from 'next/link';

import { Card, CardContent, Progress, Button } from '@/components/ui';
import { Users, Clock, MapPin, Target, Mail } from 'lucide-react';

import { CampaignShareDialog } from '@/components/campaign/share-dialog';
import { FavoriteButton } from '@/components/favorite-button';
import { CampaignDaysLeft } from '@/components/campaign/days-left';

export function CampaignCardFull({ campaign }: { campaign: CampaignDisplay }) {
  const raisedAmount = useMemo(() => {
    return (
      campaign.confirmedPayments?.reduce((sum: number, payment) => {
        const amount = Number(payment.amount) || 0;
        return sum + amount;
      }, 0) ?? 0
    );
  }, [campaign.confirmedPayments]);

  const goalAmount = useMemo(
    () => Number(campaign.fundingGoal) || 0,
    [campaign.fundingGoal],
  );

  const progress = useMemo(() => {
    if (goalAmount === 0) {
      return 0;
    }
    return Math.min((raisedAmount / goalAmount) * 100, 100);
  }, [raisedAmount, goalAmount]);

  const donationCount = campaign.donationCount;

  return (
    <Card className="sticky top-8">
      <CardContent className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="text-4xl font-bold text-green-600">
            ${raisedAmount.toLocaleString()}
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
          <p className="text-gray-600">
            pledged of ${goalAmount.toLocaleString()} goal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">{donationCount}</span>
            </div>
            <p className="text-sm text-gray-600">backers</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-2xl font-bold">
                <CampaignDaysLeft campaign={campaign} />
              </span>
            </div>
            <p className="text-sm text-gray-600">days left</p>
          </div>
        </div>

        <Link href={`/campaigns/${campaign.slug}/donation`}>
          <Button className="mt-4 h-12 w-full text-lg" size="lg">
            Back this project
          </Button>
        </Link>

        <div className="flex justify-center gap-2">
          <FavoriteButton campaignId={campaign.id} />
          <CampaignShareDialog
            campaignTitle={campaign.title}
            campaignSlug={campaign.slug}
          />
          <Button variant="outline" size="icon" className="rounded-full">
            <Mail className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="h-5 w-5" />
            <span>{campaign.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Target className="h-5 w-5" />
            <span>
              Project will be funded on{' '}
              {new Date(campaign.endTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
