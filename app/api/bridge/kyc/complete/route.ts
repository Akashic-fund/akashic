import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { customerId } = data;

    if (!customerId) {
      return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
    }

    console.log('Manually completing KYC for customer:', customerId);

    // Update the user's KYC status
    const updatedUser = await prisma.user.updateMany({
      where: { bridgeCustomerId: customerId },
      data: { isKycCompleted: true }
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'KYC status set to completed'
    });
  } catch (error) {
    console.error('Error completing KYC:', error);
    return NextResponse.json({ 
      error: 'Failed to complete KYC',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 