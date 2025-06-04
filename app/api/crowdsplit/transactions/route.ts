import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import {
  ApiAuthNotAllowed,
  ApiNotFoundError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitTransactionsPostRequest } from '@/lib/crowdsplit/api/types';
import { CrowdsplitTransactionResponse } from '@/lib/crowdsplit/types';

export async function POST(req: Request) {
  try {
    const body: CrowdsplitTransactionsPostRequest = await req.json();
    const { campaignId, type, customerId, currency, amount, paymentMethodId } =
      body;
    const session = await checkAuth(['user']);

    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.crowdsplitCustomerId) {
      throw new ApiNotFoundError('User Profile not found');
    }
    if (user.crowdsplitCustomerId !== customerId) {
      throw new ApiAuthNotAllowed('User Profile not matching');
    }

    let transaction: CrowdsplitTransactionResponse;

    if (type === 'BUY') {
      transaction = await crowdsplitService.buyTransaction({
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        fiatAmount: amount,
        paymentMethodId,
        walletAddress: session.user.address,
      });
    } else if (type === 'SELL') {
      transaction = await crowdsplitService.sellTransaction({
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        cryptoAmount: amount,
        walletAddress: session.user.address,
      });
    } else {
      throw new ApiParameterError('Invalid transaction type');
    }
    // Create a payment record in the database
    const payment = await db.payment.create({
      data: {
        user: { connect: { id: user.id } },
        type,
        amount: `${amount}`,
        token: currency, // Assuming 'token' is the correct field in your schema
        provider: 'CROWDSPLIT',
        status: 'pending',
        externalId: transaction.id?.toString() || '',
        // Properly serialize the transaction object for Prisma
        metadata: JSON.parse(JSON.stringify({ transaction })),
        campaign: { connect: { id: campaignId } },
      },
    });

    return response({
      success: true,
      paymentId: payment.id,
      transactionId: transaction.id,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
