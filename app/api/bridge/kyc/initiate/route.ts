import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bridgeService } from '@/lib/bridge-service';

interface KycData {
    redirect_url?: string
    redirectUrl?: string
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { customerId } = data;

        if (!customerId) {
            return NextResponse.json({ error: 'Missing customer ID' }, { status: 400 });
        }

        // Find user by bridgeCustomerId
        const user = await prisma.user.findFirst({
            where: { bridgeCustomerId: customerId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found for this customer ID' }, { status: 404 });
        }

        console.log('Initiating KYC for customer:', customerId);

        // Call the Bridge API to initiate KYC
        const kycData: KycData = await bridgeService.initiateKyc(customerId) as KycData;
        
        // Bridge API should return a redirect URL in the response
        // The key name may vary based on actual Bridge API response format
        const redirectUrl = kycData.redirect_url || kycData.redirectUrl; 
        
        if (!redirectUrl) {
            throw new Error('No redirect URL found in Bridge API response');
        }
        
        return NextResponse.json({
            success: true,
            redirectUrl
        });
    } catch (error) {
        console.error('Error initiating KYC:', error);
        return NextResponse.json({ 
            error: 'Failed to initiate KYC',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
} 