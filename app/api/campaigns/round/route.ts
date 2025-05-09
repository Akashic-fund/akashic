import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { campaignId, roundIds } = await req.json();

    if (!campaignId || !roundIds || !Array.isArray(roundIds)) {
      return new NextResponse(
        JSON.stringify({ error: 'Campaign ID and round IDs are required' }),
        { status: 400 },
      );
    }

    // Create entries in the RoundCampaigns table
    const roundCampaigns = await Promise.all(
      roundIds.map((roundId) =>
        prisma.roundCampaigns.create({
          data: {
            roundId,
            campaignId,
            Campaign: { connect: { id: campaignId } },
            Round: { connect: { id: roundId } },
          },
        }),
      ),
    );

    return new NextResponse(JSON.stringify(roundCampaigns), { status: 201 });
  } catch (error) {
    console.error('Failed to add campaign to rounds:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to add campaign to rounds' }),
      { status: 500 },
    );
  }
}
