import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError, ApiUpstreamError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { crowdsplitService } from '@/lib/crowdsplit/service';

// request a initiate-url for the KYC process, returns a url that the client needs to redirect to
export async function POST() {
  try {
    const session = await checkAuth(['user']);

    // Find user
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });

    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }

    // Call the Crowdsplit API to initiate KYC
    const kycData = await crowdsplitService.initiateKyc(
      user.crowdsplitCustomerId,
    );

    // Crowdsplit API should return a redirect URL in the response
    // The key name may vary based on actual Crowdsplit API response format
    const redirectUrl = kycData.redirect_url || kycData.redirectUrl;

    if (!redirectUrl) {
      throw new ApiUpstreamError(
        'No redirect URL found in Crowdsplit API response',
      );
    }

    return response({
      success: true,
      redirectUrl,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
