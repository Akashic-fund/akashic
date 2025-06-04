import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import {
  ApiAuthNotAllowed,
  ApiConflictError,
  ApiNotFoundError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

import { z } from 'zod';
import { RecipientStatus } from '@/server/db';
// import { ApplicationStatus } from "@/lib/qfInteractions"

// Define Zod schema for input validation
const registerSchema = z.object({
  campaignId: z.number().int().positive(),
  roundId: z.number().int().positive(),
  recipientAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  // Optional fields for update
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
    .optional(),
  onchainRecipientId: z.string().optional(), // Can be address or other identifier based on strategy
});

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);

    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      throw new ApiParameterError(
        'Missing required parameters',
        validation.error.errors,
      );
    }

    const {
      campaignId,
      roundId,
      recipientAddress,
      txHash,
      onchainRecipientId,
    } = validation.data;
    const walletAddress = session.user.address;
    // Optional: Verify ownership or authorization if needed

    // Use the correct model: RoundCampaigns
    const existingRegistration = await db.roundCampaigns.findUnique({
      where: {
        // Use the unique constraint defined in the schema
        roundId_campaignId: {
          roundId: roundId,
          campaignId: campaignId,
        },
      },
    });

    // --- Handle Update Request (txHash and onchainRecipientId are present) ---
    if (txHash && onchainRecipientId) {
      if (!existingRegistration) {
        // This case should ideally not happen if the flow is followed,
        // but handle it defensively.
        console.error(
          `Attempted to update non-existent RoundCampaigns record for Round ${roundId}, Campaign ${campaignId}`,
        );
        throw new ApiNotFoundError(
          'Pending registration record not found for update.',
        );
      }
      if (
        existingRegistration.submittedByWalletAddress !== session.user.address
      ) {
        throw new ApiAuthNotAllowed('Registration not created by session user');
      }
      // Ensure we are updating a PENDING record
      if (existingRegistration.status !== RecipientStatus.PENDING) {
        throw new ApiConflictError(
          `Cannot update registration with status: ${existingRegistration.status}`,
        );
      }

      // Update the existing record to APPROVED
      const updatedRegistration = await db.roundCampaigns.update({
        where: {
          // Use the unique constraint again for safety, or the ID if preferred
          roundId_campaignId: {
            roundId: roundId,
            campaignId: campaignId,
          },
          // id: existingRegistration.id // Alternative using primary key
        },
        data: {
          status: RecipientStatus.APPROVED, // Use the enum value
          txHash: txHash,
          onchainRecipientId: onchainRecipientId,
          recipientAddress: recipientAddress, // Ensure address is stored correctly
          // submittedByWalletAddress is already set during creation
          // Optionally update updatedAt timestamp automatically
        },
      });

      console.log(
        `Updated RoundCampaigns ${updatedRegistration.id} to APPROVED for Round ${roundId}, Campaign ${campaignId}`,
      );
      return response({ success: true, data: updatedRegistration });
    }

    // --- Handle Initial Registration Request (txHash and onchainRecipientId are NOT present) ---
    else {
      if (existingRegistration) {
        // Handle cases where a record already exists
        let message = `Campaign registration already exists with status: ${existingRegistration.status}`;
        if (existingRegistration.status === RecipientStatus.PENDING) {
          message = 'Registration is already pending.';
        } else if (existingRegistration.status === RecipientStatus.APPROVED) {
          message = 'Campaign is already approved for this round.';
        }
        throw new ApiConflictError(message);
      }

      // Create a new registration record with PENDING status
      const newRegistration = await db.roundCampaigns.create({
        data: {
          roundId: roundId,
          campaignId: campaignId,
          recipientAddress: recipientAddress, // Store campaign's payout address
          submittedByWalletAddress: walletAddress, // Store submitter's address
          status: RecipientStatus.PENDING, // Use the enum value
          // txHash and onchainRecipientId are null initially
        },
      });

      console.log(
        `Created new PENDING RoundCampaigns for Round ${roundId}, Campaign ${campaignId}`,
      );
      return response({ success: true, data: newRegistration });
    }
  } catch (error: unknown) {
    return handleError(error);
  }
}
