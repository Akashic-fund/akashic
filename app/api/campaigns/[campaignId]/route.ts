import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const campaignId = req.nextUrl.searchParams.get('campaignId');
    const body = await req.json();
    const { status, transactionHash, campaignAddress } = body;

    if (!campaignId) {
      return new NextResponse(
        JSON.stringify({ error: 'Campaign ID is required' }),
        { status: 400 },
      );
    }

    const campaign = await prisma.campaign.update({
      where: {
        id: parseInt(campaignId),
      },
      data: {
        status,
        transactionHash,
        campaignAddress,
      },
    });

    return new NextResponse(JSON.stringify(campaign), { status: 200 });
  } catch (error) {
    console.error('Failed to update campaign:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to update campaign' }),
      { status: 500 },
    );
  }
}
