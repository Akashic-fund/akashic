import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import ClientRewardsTab from '@/components/client-rewards-tab';
import { CampaignUpdateForm } from '@/components/campaign/update-form';
import { Timeline } from '@/components/timeline';
import { CommentForm } from '@/components/comment/form';
import { type CampaignDisplay } from '@/types/campaign';
import { PaymentList } from '@/components/payment/list';
import { PaymentEmpty } from '@/components/payment/empty';
import { campaignUpdateFormAction } from './actions/update-form';
import { commentCreateFormAction } from '../comment/actions/create-form';
import { CommentList } from '../comment/list';

export function CampaignDetailTabs({
  campaign,
}: {
  campaign: CampaignDisplay;
}) {
  return (
    <div className="container px-4 py-8">
      {/* campaigns/[slug] ]mx-auto */}
      <Tabs defaultValue="campaign" className="space-y-8">
        <TabsList className="h-12 w-full justify-start rounded-none border-b bg-transparent">
          <TabsTrigger
            value="campaign"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            Campaign
          </TabsTrigger>
          <TabsTrigger
            value="rewards"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            Rewards
          </TabsTrigger>
          <TabsTrigger
            value="updates"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            Updates ({campaign.updates?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="comments"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            Comments ({campaign.comments?.length || 0})
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600"
          >
            Transactions ({campaign.payments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="mt-6">
          <div className="max-w-3xl">
            <div className="prose prose-lg">
              <h2 className="mb-4 text-2xl font-semibold">
                About this project
              </h2>
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {campaign.description}
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="grid gap-6 md:grid-cols-[60%_40%] lg:grid-cols-[60%_40%]">
            <div className="flex flex-col">
              <ClientRewardsTab
                campaignId={campaign.id.toString()}
                campaignSlug={campaign.slug}
                campaignOwner={campaign.creatorAddress}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="updates">
          <div className="mx-auto max-w-6xl space-y-8 px-4">
            {campaign.creatorAddress && (
              <div className="mx-auto max-w-3xl">
                <CampaignUpdateForm
                  creatorAddress={campaign.creatorAddress}
                  onSubmit={async (formData, userAddress) =>
                    campaignUpdateFormAction(campaign, formData, userAddress)
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
                    Check back later for updates on this campaign&apos;s
                    progress.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <div className="max-w-3xl space-y-6">
            <CommentForm
              onSubmit={async (formData, userAddress) =>
                commentCreateFormAction(campaign, formData, userAddress)
              }
            />
            <CommentList comments={campaign.comments} />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-gray-600">
              All donations to this campaign are listed here.
            </p>

            {campaign.payments && campaign.payments.length > 0 ? (
              <PaymentList payments={campaign.payments} />
            ) : (
              <PaymentEmpty />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
