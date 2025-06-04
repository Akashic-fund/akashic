import { checkAuth } from '@/lib/api/auth';
import { ApiUpstreamError, ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitDonationCustomerPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(req: Request) {
  try {
    await checkAuth(['user']);
    const { email }: CrowdsplitDonationCustomerPostRequest = await req.json();
    if (!email) {
      throw new ApiParameterError('email is required');
    }

    const crowdsplitCustomer = await crowdsplitService.createDonationCustomer({
      email,
    });

    if (typeof crowdsplitCustomer.id !== 'string') {
      throw new ApiUpstreamError('Crowdsplit API Error');
    }

    return response({ success: true, customerId: crowdsplitCustomer.id });
  } catch (error: unknown) {
    return handleError(error);
  }
}
