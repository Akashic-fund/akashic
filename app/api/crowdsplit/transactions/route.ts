import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitTransactionsPostRequest } from '@/lib/crowdsplit/api/types';
import { CrowdsplitTransactionResponse } from '@/lib/crowdsplit/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      campaignId,
      userAddress,
      type,
      customerId,
      currency,
      amount,
      paymentMethodId,
    }: CrowdsplitTransactionsPostRequest = body;

    const user = await prisma.user.findFirst({
      where: { address: userAddress },
    });
    if (!user) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
    }
    if (user.crowdsplitCustomerId !== customerId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
    }

    let transaction: CrowdsplitTransactionResponse;

    if (type === 'BUY') {
      transaction = await crowdsplitService.buyTransaction({
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        fiatAmount: amount,
        paymentMethodId,
        walletAddress: userAddress,
      });
    } else if (type === 'SELL') {
      transaction = await crowdsplitService.sellTransaction({
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        cryptoAmount: amount,
        walletAddress: userAddress,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 },
      );
    }
    // Create a payment record in the database
    const payment = await prisma.payment.create({
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

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      transactionId: transaction.id,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create transaction',
      },
      { status: 500 },
    );
  }
}
