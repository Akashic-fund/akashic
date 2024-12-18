import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const body = await request.json()
    const { status, transactionHash, campaignAddress } = body

    const campaign = await prisma.campaign.update({
      where: {
        id: parseInt(params.campaignId)
      },
      data: {
        status,
        transactionHash,
        campaignAddress
      },
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Failed to update campaign:', error)
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    )
  }
} 