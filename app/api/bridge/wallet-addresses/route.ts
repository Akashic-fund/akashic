import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { BRIDGE_API_URL, BRIDGE_API_KEY } from '@/lib/constant';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { customerId, userAddress, walletAddress } = data;

        if (!customerId || !walletAddress) {
            return NextResponse.json({ error: 'Customer ID and wallet address are required' }, { status: 400 });
        }

        // Call the Bridge API to associate the wallet address with the customer
        const response = await fetch(`${BRIDGE_API_URL}/api/v1/customers/${customerId}/wallets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BRIDGE_API_KEY}`
            },
            body: JSON.stringify({
                wallet_address: walletAddress,
                wallet_type: 'ETH'
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add wallet address');
        }

        const responseData = await response.json();

        // Update the user with the recipient wallet address
        await prisma.user.update({
            where: { address: userAddress },
            data: { recipientWallet: walletAddress }
        });

        return NextResponse.json({
            success: true,
            message: "Wallet address added successfully",
            data: responseData
        });
    } catch (error) {
        console.error('Wallet address addition error:', error);
        return NextResponse.json(
            {
                error: 'Failed to add wallet address',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 