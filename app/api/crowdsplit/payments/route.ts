import { NextRequest, NextResponse } from 'next/server';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitCreatePaymentPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(request: NextRequest) {
  try {
    const paymentData: CrowdsplitCreatePaymentPostRequest =
      await request.json();

    const crowdsplitPayment =
      await crowdsplitService.createPayment(paymentData);
    return NextResponse.json(
      { success: true, id: crowdsplitPayment.id },
      { status: 200 },
    );
  } catch (error) {
    console.error('Crowdsplit payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
