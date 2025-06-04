'use server';

import { db } from '@/server/db';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from '@/types/actions';

interface ApplyCampaignToRoundParams {
  roundId: number;
  campaignId: number;
}

export async function applyCampaignToRound({
  roundId,
  campaignId,
}: ApplyCampaignToRoundParams): Promise<ActionResponse<void>> {
  try {
    // Check if the round exists
    const round = await db.round.findUnique({
      where: { id: roundId },
    });

    if (!round) {
      return {
        success: false,
        error: 'Round not found',
      };
    }

    // Check if the campaign exists
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return {
        success: false,
        error: 'Campaign not found',
      };
    }

    // Check if application period is open
    const now = new Date();
    if (now < round.applicationStart || now > round.applicationClose) {
      return {
        success: false,
        error: 'Application period is not open for this round',
      };
    }

    // Check if the campaign is already applied to this round
    const existingApplication = await db.roundCampaigns.findFirst({
      where: {
        roundId,
        campaignId,
      },
    });

    if (existingApplication) {
      return {
        success: false,
        error: 'This campaign is already applied to this round',
      };
    }

    // Create the application
    await db.roundCampaigns.create({
      data: {
        roundId,
        campaignId,
      },
    });

    // Revalidate the round page to show the new application
    revalidatePath(`/rounds/${roundId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error applying campaign to round:', error);
    return {
      success: false,
      error: 'Failed to apply campaign to round. Please try again later.',
    };
  }
}
