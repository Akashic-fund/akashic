import { NextRequest, NextResponse } from 'next/server';
import { crowdsplitService } from '@/lib/crowdsplit/service';
import { prisma } from '@/lib/prisma';
import { CrowdsplitPaymentMethodsPostRequest } from '@/lib/crowdsplit/api/types';

// GET endpoint to fetch payment methods from Prisma and enrich from crowdsplit service
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
        { status: 400 },
      );
    }

    // Get user ID from the database
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.crowdsplitCustomerId) {
      return NextResponse.json(
        { error: 'User profile incomplete' },
        { status: 400 },
      );
    }

    // Fetch payment methods from Prisma
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id },
    });
    // Fetch payment details from crowdsplit
    const crowdsplitPaymentMethodDetailsPromises = [];
    for (const paymentMethod of paymentMethods) {
      if (!paymentMethod.externalId) {
        continue;
      }
      crowdsplitPaymentMethodDetailsPromises.push(
        crowdsplitService.getPaymentMethod({
          id: paymentMethod.externalId,
          customerId: user.crowdsplitCustomerId,
        }),
      );
    }
    const crowdsplitPaymentMethodDetails = await Promise.all(
      crowdsplitPaymentMethodDetailsPromises,
    );
    return NextResponse.json({
      paymentMethods: paymentMethods.map(
        (paymentMethod: {
          id: number;
          externalId: string;
          provider: string;
          type: string;
          userId: number;
          createdAt: Date;
          updatedAt: Date;
        }) => {
          const crowdsplitDetails =
            crowdsplitPaymentMethodDetails.find(
              ({ id }) => id === paymentMethod.externalId,
            ) ?? null;
          const details = crowdsplitDetails?.bankDetails ?? null;
          return {
            ...paymentMethod,
            details,
          };
        },
      ),
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 },
    );
  }
}

// POST endpoint to add a new payment method
export async function POST(req: NextRequest) {
  try {
    const {
      userAddress,
      type,
      provider,
      bankDetails,
    }: CrowdsplitPaymentMethodsPostRequest = await req.json();

    console.log('Received payment method request:', {
      userAddress,
      type,
      provider,
    });

    if (!userAddress || !type || !provider || !bankDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { address: userAddress },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.crowdsplitCustomerId) {
      return NextResponse.json(
        {
          error:
            'User not yet a crowdsplit customer, profile information missing',
        },
        { status: 400 },
      );
    }

    try {
      // Ensure we're sending exactly the format Crowdsplit expects

      // Create payment method in Crowdsplit
      const response = await crowdsplitService.createPaymentMethod({
        customerId: user.crowdsplitCustomerId,
        type,
        bankDetails,
      });

      if (!response.id) {
        throw new Error('Failed to create payment method in Crowdsplit');
      }

      // Save payment method to Prisma
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          provider,
          externalId: response.id,
          type,
          user: { connect: { id: user.id } },
        },
      });

      return NextResponse.json({ success: true, paymentMethod });
    } catch (crowdsplitError) {
      console.error('Crowdsplit API error:', crowdsplitError);
      return NextResponse.json(
        {
          error: `Crowdsplit API error: ${crowdsplitError instanceof Error ? crowdsplitError.message : 'Unknown error'}`,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create payment method',
      },
      { status: 500 },
    );
  }
}
