import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const campaignId = (await params).id; // Get the ID from the query parameters

  try {
    const roundCampaigns = await prisma.roundCampaigns.findMany({
      where: { campaignId: parseInt(campaignId) },
      include: { Round: true }, // Include round details
    });

    if (roundCampaigns.length == 0) {
      return NextResponse.json({ rounds: [] }, { status: 200 });
    }

    const rounds = roundCampaigns.map(
      (rc: { roundId: number; Round: { title: string } }) => ({
        id: rc.roundId,
        title: rc.Round.title,
      }),
    );

    return NextResponse.json({ rounds }, { status: 200 });
  } catch (error) {
    console.error(
      'Failed to fetch rounds for campaign:',
      (error as unknown as Error).stack,
    );
    return NextResponse.json(
      { error: 'Failed to fetch rounds' },
      { status: 500 },
    );
  }
}
