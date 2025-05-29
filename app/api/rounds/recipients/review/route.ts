import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RecipientStatus } from '@/types/round';
// import { ApplicationStatus } from "@/lib/qfInteractions"

export async function POST(request: NextRequest) {
  try {
    const { roundId, updates, managerAddress } = await request.json();

    if (!roundId || !updates || !managerAddress || !Array.isArray(updates)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Verify the user is an admin for this round
    const round = await prisma.round.findFirst({
      where: {
        id: roundId,
        managerAddress: managerAddress.toLowerCase(),
      },
    });

    if (!round) {
      return NextResponse.json(
        { success: false, error: 'Round not found or you are not an admin' },
        { status: 403 },
      );
    }

    // Update each recipient status
    const updatePromises = updates.map(({ address }: { address: string }) =>
      prisma.roundCampaigns.updateMany({
        where: {
          roundId,
          Campaign: {
            creatorAddress: address,
          },
        },
        data: {
          status: RecipientStatus.PENDING,
          reviewedAt: new Date(),
        },
      }),
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update recipient statuses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipient statuses' },
      { status: 500 },
    );
  }
}
