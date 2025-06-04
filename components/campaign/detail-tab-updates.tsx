'use client';
import { CampaignUpdateForm } from '@/components/campaign/update-form';
import { Timeline } from '@/components/timeline';
import { CampaignDisplay } from '@/types/campaign';
import { campaignUpdateFormAction } from './actions/update-form';

export function CampaignDetailTabUpdates({
  campaign,
}: {
  campaign: CampaignDisplay;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4">
      {campaign.creatorAddress && (
        <div className="mx-auto max-w-3xl">
          <CampaignUpdateForm
            creatorAddress={campaign.creatorAddress}
            onSubmit={async (formData) =>
              campaignUpdateFormAction(campaign, formData)
            }
          />
        </div>
      )}

      {campaign.updates && campaign.updates.length > 0 ? (
        <Timeline
          items={campaign.updates.map((update) => ({
            ...update,
            id: update.id.toString(),
          }))}
          className="w-full"
        />
      ) : (
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border border-gray-100 bg-gray-50 py-12 text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-700">
              No Updates Yet
            </h3>
            <p className="text-gray-500">
              Check back later for updates on this campaign&apos;s progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
