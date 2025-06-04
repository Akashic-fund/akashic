import { checkAuth } from '@/lib/api/auth';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitPaymentsWithIdParams } from '@/lib/crowdsplit/api/types';

export async function POST(
  req: Request,
  { params }: CrowdsplitPaymentsWithIdParams,
) {
  try {
    await checkAuth(['user']);
    const { id } = await params;

    const credentials = await crowdsplitService.confirmPayment({ id });
    return response({ success: true, ...credentials });
  } catch (error: unknown) {
    return handleError(error);
  }
}
