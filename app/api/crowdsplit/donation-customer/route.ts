import { NextRequest, NextResponse } from 'next/server';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitDonationCustomerPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(request: NextRequest) {
  try {
    const { email }: CrowdsplitDonationCustomerPostRequest =
      await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const crowdsplitCustomer = await crowdsplitService.createDonationCustomer({
      email,
    });

    if (typeof crowdsplitCustomer.id !== 'string') {
      return NextResponse.json(
        { error: 'Crowdsplit API Error' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, customerId: crowdsplitCustomer.id },
      { status: 200 },
    );
  } catch (error) {
    console.error('Crowdsplit customer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
