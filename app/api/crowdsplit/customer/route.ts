import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { CrowdsplitCustomerPostRequest } from '@/lib/crowdsplit/api/types';

export async function POST(request: NextRequest) {
  try {
    const data: CrowdsplitCustomerPostRequest = await request.json();
    const { userAddress, ...customerData } = data;

    if (!userAddress) {
      return NextResponse.json(
        { error: 'Missing user address' },
        { status: 400 },
      );
    }

    // Find user by address
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    try {
      // Call Crowdsplit API to create customer
      const crowdsplitCustomer =
        await crowdsplitService.createCustomer(customerData);

      if (typeof crowdsplitCustomer.id !== 'string') {
        return NextResponse.json(
          { error: 'Crowdsplit API Error' },
          { status: 400 },
        );
      }
      // Update user with Crowdsplit customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: {
          crowdsplitCustomerId: crowdsplitCustomer.id,
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
        },
      });

      return NextResponse.json({
        success: true,
        customerId: crowdsplitCustomer.id,
      });
    } catch (crowdsplitError) {
      console.error('Crowdsplit API error:', crowdsplitError);
      return NextResponse.json(
        {
          error: 'Failed to create Crowdsplit customer',
          details:
            crowdsplitError instanceof Error
              ? crowdsplitError.message
              : String(crowdsplitError),
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error creating Crowdsplit customer:', error);
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userAddress = request.nextUrl.searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'Missing user address' },
        { status: 400 },
      );
    }

    // Find user by address
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json({
        hasCustomer: false,
        message: 'User not found',
      });
    }

    // No need to fetch from Crowdsplit API - use local data
    return NextResponse.json({
      hasCustomer: !!user.crowdsplitCustomerId,
      customerId: user.crowdsplitCustomerId,
      isKycCompleted: user.isKycCompleted,
    });
  } catch (error) {
    console.error('Error fetching Crowdsplit customer:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch customer information',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
