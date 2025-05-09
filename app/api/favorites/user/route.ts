import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userAddress,
      },
      include: {
        campaign: {
          include: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user favorites' },
      { status: 500 },
    );
  }
}
