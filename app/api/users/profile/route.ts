import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userAddress, lastName, firstName, username, bio, recipientWallet } =
      await request.json();

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.address !== userAddress) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 },
        );
      }
    }

    // Find or create the user
    const user = await prisma.user.upsert({
      where: { address: userAddress },
      update: {
        firstName,
        lastName,
        username,
        ...(recipientWallet && { recipientWallet }),
        bio,
      },
      create: {
        address: userAddress,
        firstName,
        lastName,
        username,
        recipientWallet,
        bio,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile data' },
      { status: 500 },
    );
  }
}
