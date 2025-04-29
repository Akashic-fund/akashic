import { NextRequest, NextResponse } from 'next/server';
import { bridgeService, BridgeTransactionResponse } from '@/lib/bridge-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, customerId, currency, amount, paymentMethodId, walletAddress } = body;

    let transaction: BridgeTransactionResponse;

    if (type === 'buy') {
      transaction = await bridgeService.buyTransaction({ 
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        fiatAmount: amount,
        paymentMethodId,
        walletAddress
      });
    } else if (type === 'sell') {
      transaction = await bridgeService.sellTransaction({
        customerId,
        fiatCurrency: currency,
        cryptoCurrency: 'USDC', // Default or from request
        cryptoAmount: amount,
        walletAddress
      });
    } else {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
    }

    // Create a payment record in the database
    // const payment = await prisma.payment.create({
    //   data: {
    //     userId: customerId,
    //     amount,
    //     token: currency, // Assuming 'token' is the correct field in your schema
    //     provider: 'BRIDGE',
    //     status: 'pending',
    //     type: type.toUpperCase(), 
    //     externalId: transaction.id?.toString() || '',
    //     // Properly serialize the transaction object for Prisma
    //     metadata: JSON.parse(JSON.stringify({ transaction })),
    //   },
    // });

    return NextResponse.json({
      success: true,
      // paymentId: payment.id, 
      transactionId: transaction.id,
    });

  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 