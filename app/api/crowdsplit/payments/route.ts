import { checkAuth } from '@/lib/api/auth';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitCreatePaymentPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(req: Request) {
  try {
    await checkAuth(['user']);
    const paymentData: CrowdsplitCreatePaymentPostRequest = await req.json();

    const crowdsplitPayment =
      await crowdsplitService.createPayment(paymentData);
    return response({ success: true, id: crowdsplitPayment.id });
  } catch (error: unknown) {
    return handleError(error);
  }
}
