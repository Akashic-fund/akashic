import { db } from '@/server/db';
import { isAdmin } from '@/lib/api/auth';
import { response, handleError } from '@/lib/api/response';
import { CampaignStatus } from '@/types/campaign';

/**
 * Stats about campaigns
 * Admin users get extra fields
 */
export async function GET() {
  try {
    const [draftCount, activeCount, completedCount, pendingApprovalCount] =
      await Promise.all([
        db.campaign.count({
          where: {
            status: CampaignStatus.DRAFT,
          },
        }),
        db.campaign.count({
          where: {
            status: CampaignStatus.ACTIVE,
          },
        }),
        db.campaign.count({
          where: {
            status: CampaignStatus.COMPLETED,
          },
        }),
        db.campaign.count({
          where: {
            status: CampaignStatus.PENDING_APPROVAL,
          },
        }),
      ]);
    const [confirmedPaymentsAmount, pendingPaymentsAmount] = (await Promise.all(
      [
        db.$queryRaw`
        SELECT SUM(CAST("amount" AS FLOAT)) AS total_sum
        FROM "Payment"
        WHERE
          "status" = 'confirmed'
          AND "amount" ~ '^[0-9]+(\.[0-9]+)?$'
          AND "token" = 'USDC'
      `,
        db.$queryRaw`
        SELECT SUM(CAST("amount" AS FLOAT)) AS total_sum
        FROM "Payment"
        WHERE
          "status" = 'pending'
          AND "amount" ~ '^[0-9]+(\.[0-9]+)?$'
          AND "token" = 'USDC'
      `,
      ],
    )) as Array<Array<{ total_sum: number }>>;
    const data = {
      draftCount,
      activeCount,
      completedCount,
      pendingApprovalCount,
      confirmedPaymentsAmount: confirmedPaymentsAmount[0].total_sum,
      pendingPaymentsAmount: pendingPaymentsAmount[0].total_sum,
    };
    if (!(await isAdmin())) {
      data.draftCount = 0;
      data.pendingPaymentsAmount = -1;
      data.pendingApprovalCount = -1;
    }
    return response(data);
  } catch (error: unknown) {
    return handleError(error);
  }
}
