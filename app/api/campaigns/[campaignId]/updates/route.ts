import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const { title, content, creatorAddress } = await request.json();
    const campaignId = parseInt((await params).campaignId);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // Verify the creator is the campaign owner
    if (
      campaign.creatorAddress.toLowerCase() !== creatorAddress.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Unauthorized - Only campaign creator can post updates' },
        { status: 403 },
      );
    }

    const update = await prisma.campaignUpdate.create({
      data: {
        title,
        content,
        campaignId: campaign.id,
        creatorAddress,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Failed to create update' },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> },
) {
  try {
    const campaignId = parseInt((await params).campaignId);

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 },
      );
    }

    // Get all updates for the campaign
    const updates = await prisma.campaignUpdate.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 },
    );
  }
}
