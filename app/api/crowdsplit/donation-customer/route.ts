import { checkAuth } from '@/lib/api/auth';
import { ApiUpstreamError, ApiParameterError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitDonationCustomerPostRequest } from '@/lib/crowdsplit/api/types';
import { db } from '@/server/db';

const debug = process.env.NODE_ENV !== 'production';

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const { email }: CrowdsplitDonationCustomerPostRequest = await req.json();
    if (!email) {
      throw new ApiParameterError('email is required');
    }

    debug &&
      console.log('[Donation Customer] Starting customer operation for:', {
        userAddress: session.user.address,
        email,
      });

    // Find user by address to check for existing customer
    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });

    if (!user) {
      throw new ApiParameterError('User not found');
    }

    debug &&
      console.log('[Donation Customer] User found:', {
        userId: user.id,
        hasExistingCustomerId: !!user.crowdsplitCustomerId,
        existingCustomerId: user.crowdsplitCustomerId || 'none',
      });

    // If user already has a crowdsplitCustomerId, try to retrieve existing customer
    if (user.crowdsplitCustomerId) {
      debug &&
        console.log(
          '[Donation Customer] Attempting to retrieve existing customer:',
          user.crowdsplitCustomerId,
        );

      try {
        const existingCustomer = await crowdsplitService.getCustomer(
          user.crowdsplitCustomerId,
        );

        debug &&
          console.log(
            '[Donation Customer] Successfully retrieved existing customer:',
            {
              customerId: existingCustomer.id,
              email: existingCustomer.email,
            },
          );

        return response({
          success: true,
          customerId: existingCustomer.id,
          isExisting: true,
        });
      } catch (error) {
        // If customer doesn't exist on CrowdSplit side (e.g., deleted),
        // fall through to create a new one and update our DB
        debug &&
          console.warn(
            '[Donation Customer] Failed to retrieve existing customer, will create new:',
            {
              customerId: user.crowdsplitCustomerId,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
          );

        console.warn(
          `Failed to retrieve existing customer ${user.crowdsplitCustomerId}, creating new one:`,
          error,
        );
      }
    } else {
      debug &&
        console.log(
          '[Donation Customer] No existing customer ID found, will create new customer',
        );
    }

    // Create new customer if none exists or retrieval failed
    debug &&
      console.log(
        '[Donation Customer] Creating new customer for email:',
        email,
      );

    const crowdsplitCustomer = await crowdsplitService.createDonationCustomer({
      email,
    });

    if (typeof crowdsplitCustomer.id !== 'string') {
      throw new ApiUpstreamError('CrowdSplit API Error');
    }

    debug &&
      console.log('[Donation Customer] Successfully created new customer:', {
        customerId: crowdsplitCustomer.id,
        email: crowdsplitCustomer.email,
      });

    // Update user record with new customer ID
    await db.user.update({
      where: { address: session.user.address },
      data: {
        crowdsplitCustomerId: crowdsplitCustomer.id,
      },
    });

    debug &&
      console.log(
        '[Donation Customer] Updated user record with new customer ID:',
        {
          userId: user.id,
          newCustomerId: crowdsplitCustomer.id,
        },
      );

    return response({
      success: true,
      customerId: crowdsplitCustomer.id,
      isExisting: false,
    });
  } catch (error: unknown) {
    debug &&
      console.error('[Donation Customer] Operation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });

    return handleError(error);
  }
}
