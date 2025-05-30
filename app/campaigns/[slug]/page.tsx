import { notFound } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
// import { getCampaignBySlug, type PaymentWithUser } from "@/lib/api/campaigns";
import { CampaignDisplay } from '@/types/campaign';
import { getCampaign } from '@/lib/database';
import { PageHeader } from '@/components/page/header';
import { CampaignMainImage } from '@/components/campaign/main-image';
import { CampaignCardFull } from '@/components/campaign/card-full';
import { CampaignDetailTabs } from '@/components/campaign/detail-tabs';
import { PageHome } from '@/components/page/home';

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const campaign: CampaignDisplay = await getCampaign((await params).slug);

  if (!campaign) {
    notFound();
  }

  const header = (
    <PageHeader featured={true} tags={['Technology']} title={campaign.title}>
      <Avatar className="h-10 w-10">
        <AvatarImage src="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="px-2">
        <p className="font-medium">
          {campaign.creatorAddress.slice(0, 6)}...
          {campaign.creatorAddress.slice(-4)}
        </p>
        <p className="text-sm text-gray-500">
          {campaign.location || 'Location not specified'}
        </p>
      </div>
    </PageHeader>
  );
  return (
    <PageHome header={header}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <CampaignMainImage campaign={campaign} />
        <div className="lg:col-span-4">
          <CampaignCardFull campaign={campaign} />
        </div>
        <div className="lg:col-span-8">
          <CampaignDetailTabs campaign={campaign} />
        </div>
      </div>
    </PageHome>
  );
}
