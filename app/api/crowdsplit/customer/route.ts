import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError, ApiUpstreamError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitCustomerPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const customerData: CrowdsplitCustomerPostRequest = await req.json();

    // Call Crowdsplit API to create customer
    const crowdsplitCustomer =
      await crowdsplitService.createCustomer(customerData);

    if (typeof crowdsplitCustomer.id !== 'string') {
      throw new ApiUpstreamError('Crowdsplit API Error');
    }
    // Update user with Crowdsplit customer ID
    await db.user.update({
      where: { address: session.user.address },
      data: {
        crowdsplitCustomerId: crowdsplitCustomer.id,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
      },
    });

    return response({
      success: true,
      customerId: crowdsplitCustomer.id,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const session = await checkAuth(['user']);

    // Find user by address
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });

    if (!user) {
      throw new ApiNotFoundError('User not found');
    }

    // No need to fetch from Crowdsplit API - use local data
    return response({
      hasCustomer: !!user.crowdsplitCustomerId,
      customerId: user.crowdsplitCustomerId,
      isKycCompleted: user.isKycCompleted,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
