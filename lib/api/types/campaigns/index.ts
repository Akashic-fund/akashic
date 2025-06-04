export interface CampaignsWithIdParams {
  params: Promise<{
    campaignId: string;
  }>;
}
export interface PostCampaignsWithIdApproveBody {
  treasuryAddress?: string;
}
export interface PostCampaignsWithIdUpdatesBody {
  title?: string;
  content?: string;
}
export interface PostCampaignsRouteBody {
  campaignId: number;
  roundIds: number[];
}
