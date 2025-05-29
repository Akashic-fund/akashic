import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crowdsplitService } from '@/lib/crowdsplit/service';

interface KycStatusData {
  status: string;
}

export async function GET(request: NextRequest) {
  try {
    const userAddress = request.nextUrl.searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        {
          error: 'Missing user address',
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Find user by crowdsplitCustomerId
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not found',
        },
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }
    if (!user.crowdsplitCustomerId) {
      return NextResponse.json(
        {
          error: 'User profile not found',
        },
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    try {
      // Get the KYC status from Crowdsplit API
      const statusData: KycStatusData = (await crowdsplitService.getKycStatus(
        user.crowdsplitCustomerId,
      )) as KycStatusData;
      const status = statusData.status || 'pending';

      // If KYC is completed according to Crowdsplit, update our database
      if (status === 'completed' && !user.isKycCompleted) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isKycCompleted: true },
        });
      }

      return NextResponse.json(
        {
          status,
          customerId: user.crowdsplitCustomerId,
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (crowdsplitError) {
      console.error('Crowdsplit API error:', crowdsplitError);
      // Still return valid JSON even if Crowdsplit API fails
      return NextResponse.json(
        {
          status: user.isKycCompleted ? 'completed' : 'pending',
          customerId: user.crowdsplitCustomerId,
          crowdsplitError:
            crowdsplitError instanceof Error
              ? crowdsplitError.message
              : String(crowdsplitError),
        },
        { headers: { 'Content-Type': 'application/json' } },
      );
    }
  } catch (error) {
    console.error('Error checking KYC status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check KYC status',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
