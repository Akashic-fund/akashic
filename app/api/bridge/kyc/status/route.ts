import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { bridgeService } from '@/lib/bridge-service';

interface KycStatusData {
    status: string
}

export async function GET(request: NextRequest) {
    try {
        const customerId = request.nextUrl.searchParams.get('customerId');
        
        if (!customerId) {
            return NextResponse.json({ 
                error: 'Missing customer ID' 
            }, { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // Find user by bridgeCustomerId
        const user = await prisma.user.findFirst({
            where: { bridgeCustomerId: customerId }
        });

        if (!user) {
            return NextResponse.json({ 
                error: 'User not found for this customer ID' 
            }, { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        console.log('Checking KYC status for customer:', customerId);

        try {
            // Get the KYC status from Bridge API
            const statusData: KycStatusData = await bridgeService.getKycStatus(customerId) as KycStatusData;
            const status = statusData.status || 'pending';
            
            // If KYC is completed according to Bridge, update our database
            if (status === 'completed' && !user.isKycCompleted) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isKycCompleted: true }
                });
            }
            
            return NextResponse.json({
                status,
                customerId
            }, { headers: { 'Content-Type': 'application/json' } });
        } catch (bridgeError) {
            console.error('Bridge API error:', bridgeError);
            // Still return valid JSON even if Bridge API fails
            return NextResponse.json({ 
                status: user.isKycCompleted ? 'completed' : 'pending',
                customerId,
                bridgeError: bridgeError instanceof Error ? bridgeError.message : String(bridgeError)
            }, { headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error('Error checking KYC status:', error);
        return NextResponse.json({ 
            error: 'Failed to check KYC status',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
} 