import { NextRequest, NextResponse } from 'next/server';
import { bridgeService } from '@/lib/bridge-service';
import { prisma } from '@/lib/prisma';

// GET endpoint to fetch payment methods from Prisma
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 });
    }

    // Get user ID from the database
    const user = await prisma.user.findUnique({
      where: { address: userAddress }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch payment methods from Prisma
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new payment method
export async function POST(req: NextRequest) {
  try {
    const { userAddress, customerId, type, bank_details } = await req.json();

    console.log('Received payment method request:', {
      userAddress,
      customerId,
      type,
      bank_details: bank_details ? {
        ...bank_details,
        accountNumber: '****' + bank_details.accountNumber.slice(-4) // Log safely
      } : null
    });

    if (!userAddress || !customerId || !type || !bank_details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { address: userAddress }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Log the user record from the database for debugging
    console.log('User record from database:', {
      id: user.id,
      address: user.address,
      bridgeCustomerId: user.bridgeCustomerId
    });

    // Double-check the customerId format before sending to Bridge
    if (!user.bridgeCustomerId) {
      return NextResponse.json(
        { error: 'User does not have a Bridge customer ID' },
        { status: 400 }
      );
    }

    if (user.bridgeCustomerId !== customerId) {
      console.log(`Customer ID mismatch: From request ${customerId}, from DB ${user.bridgeCustomerId}`);
      // Consider whether to fail or proceed with the DB value
    }

    // Use the customer ID from the database to ensure it's correct
    const correctCustomerId = user.bridgeCustomerId;
    console.log('Correct customer ID:', correctCustomerId);

    try {
      // Ensure we're sending exactly the format Bridge expects
      const bridgePayload = {
        customerId,
        type,
        bank_details
      };

      console.log('Sending to Bridge service:', {
        ...bridgePayload,
        bank_details: {
          ...bridgePayload.bank_details,
          accountNumber: '****' + bridgePayload.bank_details.accountNumber.slice(-4)
        }
      });

      // Create payment method in Bridge
      const response = await bridgeService.createPaymentMethod(bridgePayload);

      if (!response.id) {
        throw new Error('Failed to create payment method in Bridge');
      }

      // Save payment method to Prisma
      const paymentMethod = await prisma.paymentMethod.create({
        data: {
          provider: 'BRIDGE',
          externalId: response.id,
          type: type,
          userId: user.id,
          details: bank_details
        }
      });

      return NextResponse.json({ success: true, paymentMethod });
    } catch (bridgeError) {
      console.error('Bridge API error:', bridgeError);
      return NextResponse.json(
        { error: `Bridge API error: ${bridgeError instanceof Error ? bridgeError.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create payment method' },
      { status: 500 }
    );
  }
}
