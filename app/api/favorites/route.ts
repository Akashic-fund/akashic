import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Toggle favorite status
export async function POST(request: NextRequest) {
  try {
    const { userAddress, campaignId } = await request.json();
    console.log({ userAddress, campaignId });
    if (!userAddress || !campaignId) {
      return NextResponse.json(
        { error: 'User address and campaign ID are required' },
        { status: 400 },
      );
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userAddress_campaignId: {
          userAddress,
          campaignId: Number(campaignId),
        },
      },
    });

    if (existingFavorite) {
      // Remove favorite if it exists
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ isFavorite: false });
    } else {
      // Add favorite if it doesn't exist
      await prisma.favorite.create({
        data: {
          userAddress,
          campaignId: Number(campaignId),
        },
      });
      return NextResponse.json({ isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite status' },
      { status: 500 },
    );
  }
}

// Get favorite status for a campaign
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get('userAddress');
    const campaignId = searchParams.get('campaignId');

    if (!userAddress || !campaignId) {
      return NextResponse.json(
        { error: 'User address and campaign ID are required' },
        { status: 400 },
      );
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        userAddress_campaignId: {
          userAddress,
          campaignId: Number(campaignId),
        },
      },
    });

    return NextResponse.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 },
    );
  }
}
