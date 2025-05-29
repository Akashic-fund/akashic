import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crowdsplitService } from '@/lib/crowdsplit/service';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { userAddress, walletAddress } = data;
  if (!userAddress) {
    return NextResponse.json(
      { error: 'User address is required' },
      { status: 400 },
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.crowdsplitCustomerId) {
      return NextResponse.json(
        {
          error: 'User profile not found',
        },
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Call the Crowdsplit API to associate the wallet address with the customer
    if (walletAddress) {
      await crowdsplitService.associatWallet({
        customerId: user.crowdsplitCustomerId,
        walletAddress,
        walletType: 'ETH',
      });
    }

    // Update the user with the recipient wallet address
    await prisma.user.update({
      where: { address: userAddress },
      data: { recipientWallet: walletAddress },
    });

    return NextResponse.json({
      success: true,
      message: 'Wallet address added successfully',
    });
  } catch (error) {
    console.error('Wallet address addition error:', error);
    return NextResponse.json(
      {
        error: 'Failed to add wallet address',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
