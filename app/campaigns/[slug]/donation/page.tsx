import DonationForm from '@/components/donation/donation-form';
import ProjectInfo from '@/components/project-info';
import { Campaign } from '@/types/campaign';
import { getCampaign } from '@/lib/database';
import { PageHeaderSticky } from '@/components/page/header-sticky';
import { PageMainTwoColums } from '@/components/page/two-cols';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const campaign: Campaign = await getCampaign(slug);
  return (
    <>
      <PageHeaderSticky message="Donating to" title={campaign.title} />
      <PageMainTwoColums>
        <DonationForm campaign={campaign} />
        <ProjectInfo slug={slug} />
      </PageMainTwoColums>
    </>
  );
}
