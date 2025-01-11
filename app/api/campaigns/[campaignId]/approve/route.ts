import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { adminAddress } from '@/lib/constant'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ campaignId: string }> }
) {
    try {
        const campaignId = parseInt((await params).campaignId)

        if (!campaignId) {
            return NextResponse.json(
                { error: 'Campaign ID is required' },
                { status: 400 }
            )
        }

        const { adminAddress: requestAddress, treasuryAddress } = await req.json()

        // Verify admin
        if (!requestAddress || requestAddress.toLowerCase() !== adminAddress?.toLowerCase()) {
            return NextResponse.json(
                { error: 'Unauthorized: Admin access only' },
                { status: 401 }
            )
        }

        // Get campaign info from database
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId }
        })

        console.log('campaign', campaign)

        if (!campaign) {
            return NextResponse.json(
                { error: 'Campaign not found' },
                { status: 404 }
            )
        }

        if (!campaign.campaignAddress) {
            return NextResponse.json(
                { error: 'Campaign address not found' },
                { status: 400 }
            )
        }

        console.log('campaign.campaignAddress', campaign.campaignAddress, 'treasuryAddress', treasuryAddress)

        // Update campaign status and treasury address in database
        const updatedCampaign = await prisma.campaign.update({
            where: { id: campaignId },
            data: {
                status: 'active',
            }
        })

        console.log('updatedCampaign', updatedCampaign)

        return NextResponse.json({
            campaign: updatedCampaign
        })
    } catch (error) {
        console.error('Error updating campaign status:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to update campaign status'
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        )
    }
}
