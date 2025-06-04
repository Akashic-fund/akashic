import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { CampaignsWithIdParams } from '@/lib/api/types';
import { db, Payment, User } from '@/server/db';
interface PaymentWithUserType extends Payment {
  user: User | null;
}
interface PaymentWithWhitelistedUserType extends Payment {
  user: {
    id: number;
    address: string;
    firstName: string;
    lastName: string;
  } | null;
}
export async function GET(req: Request, { params }: CampaignsWithIdParams) {
  try {
    const { campaignId: campaignIdOrSlug } = await params;
    let where = undefined;
    if (!isNaN(Number(campaignIdOrSlug))) {
      where = { id: Number(campaignIdOrSlug) };
    } else {
      where = { slug: campaignIdOrSlug };
    }
    const instance = await db.campaign.findUnique({
      where,
      include: {
        images: true,
        payments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        comments: true,
        updates: true,
      },
    });
    if (!instance) {
      throw new ApiNotFoundError('Campaign not found');
    }
    const campaign = {
      ...instance,
      payments:
        instance.payments?.reduce(
          (
            accumulator: PaymentWithWhitelistedUserType[],
            payment: PaymentWithUserType,
          ) => {
            if (isNaN(Number(payment.amount)) || !payment.user) {
              return accumulator;
            }
            if (payment.isAnonymous) {
              const anonymousUser = {
                id: 0,
                address: '0x00000000000000000000000000000000',
                firstName: 'Arno',
                lastName: 'Nym',
              };
              return accumulator.concat({ ...payment, user: anonymousUser });
            }
            const whitelistedUser = {
              id: payment.user.id,
              address: payment.user.address,
              firstName: payment.user.firstName,
              lastName: payment.user.lastName,
            };
            return accumulator.concat({
              ...payment,
              user: whitelistedUser,
            } as PaymentWithWhitelistedUserType);
          },
          [],
        ) ?? [],
    };

    return response({ campaign });
  } catch (error: unknown) {
    handleError(error);
  }
}
