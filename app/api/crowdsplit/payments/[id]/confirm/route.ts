import { NextRequest, NextResponse } from 'next/server';
import { crowdsplitService } from '@/lib/crowdsplit/service';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const credentials = await crowdsplitService.confirmPayment({ id });
    return NextResponse.json(
      { success: true, ...credentials },
      { status: 200 },
    );
  } catch (error) {
    console.error('Crowdsplit payment confirm error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
