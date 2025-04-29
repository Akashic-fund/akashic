import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bridgeService } from '@/lib/bridge-service';

interface BridgeCustomer {
  id: string;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userAddress, ...customerData } = data;

    if (!userAddress) {
      return NextResponse.json({ error: 'Missing user address' }, { status: 400 });
    }

    // Find user by address
    const user = await prisma.user.findUnique({
      where: { address: userAddress }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Creating Bridge customer with data:', customerData);

    try {
      // Call Bridge API to create customer
      const bridgeCustomer: BridgeCustomer = await bridgeService.createCustomer(customerData) as BridgeCustomer;
      
      // Update user with Bridge customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          bridgeCustomerId: bridgeCustomer.id,
          firstName: customerData.first_name,
          lastName: customerData.last_name,
          email: customerData.email
        }
      });
      
      return NextResponse.json({
        success: true,
        customerId: bridgeCustomer.id
      });
    } catch (bridgeError) {
      console.error('Bridge API error:', bridgeError);
      return NextResponse.json({
        error: 'Failed to create Bridge customer',
        details: bridgeError instanceof Error ? bridgeError.message : String(bridgeError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating Bridge customer:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const userAddress = request.nextUrl.searchParams.get('userAddress');
    
//     if (!userAddress) {
//       return NextResponse.json({ error: 'Missing user address' }, { status: 400 });
//     }

//     // Find user by address
//     const user = await prisma.user.findUnique({
//       where: { address: userAddress }
//     });

//     if (!user) {
//       return NextResponse.json({ 
//         hasCustomer: false,
//         message: 'User not found' 
//       });
//     }

//     // No need to fetch from Bridge API - use local data
//     return NextResponse.json({
//       hasCustomer: !!user.bridgeCustomerId,
//       customerId: user.bridgeCustomerId,
//       isKycCompleted: user.isKycCompleted
//     });
//   } catch (error) {
//     console.error('Error fetching Bridge customer:', error);
//     return NextResponse.json({ 
//       error: 'Failed to fetch customer information',
//       details: error instanceof Error ? error.message : String(error)
//     }, { status: 500 });
//   }
// } 