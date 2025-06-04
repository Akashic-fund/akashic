'use client';
import { CampaignDisplay } from '@/types/campaign';
import { CommentList } from '../comment/list';
import { CommentForm } from '@/components/comment/form';
import { commentCreateFormAction } from '../comment/actions/create-form';

export function CampaignDetailTabComments({
  campaign,
}: {
  campaign: CampaignDisplay;
}) {
  return (
    <div className="max-w-3xl space-y-6">
      <CommentForm
        onSubmit={async (formData) =>
          commentCreateFormAction(campaign, formData)
        }
      />
      <CommentList comments={campaign.comments} />
    </div>
  );
}
