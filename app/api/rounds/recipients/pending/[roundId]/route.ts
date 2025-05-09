import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { ApplicationStatus } from "@/lib/qfInteractions"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roundId: string }> },
) {
  try {
    const resolvedParams = await params; // Await the Promise
    const roundId = parseInt(resolvedParams.roundId, 10);

    if (isNaN(roundId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid round ID' },
        { status: 400 },
      );
    }

    const recipients = await prisma.roundCampaigns.findMany({
      where: {
        roundId,
      },
      include: {
        Campaign: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, recipients });
  } catch (error) {
    console.error('Failed to fetch pending recipients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pending recipients' },
      { status: 500 },
    );
  }
}
