import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RecipientStatus } from '@/.generated/prisma/client';
// import { ApplicationStatus } from "@/lib/qfInteractions"

// Define Zod schema for input validation
const registerSchema = z.object({
  campaignId: z.number().int().positive(),
  roundId: z.number().int().positive(),
  recipientAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'), // Submitter's wallet
  // Optional fields for update
  txHash: z
    .string()
    .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
    .optional(),
  onchainRecipientId: z.string().optional(), // Can be address or other identifier based on strategy
});

export async function POST(req: Request) {
  try {
    // Optional: Get current user session if needed for authorization
    // const user = await getCurrentUser()
    // if (!user) {
    //     return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    // }

    const body = await req.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const {
      campaignId,
      roundId,
      recipientAddress,
      walletAddress, // Address of the user submitting the request
      txHash,
      onchainRecipientId,
    } = validation.data;

    // Optional: Verify ownership or authorization if needed
    // e.g., check if walletAddress matches the logged-in user or campaign owner

    // Use the correct model: RoundCampaigns
    const existingRegistration = await prisma.roundCampaigns.findUnique({
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
        return NextResponse.json(
          {
            success: false,
            error: 'Pending registration record not found for update.',
          },
          { status: 404 },
        );
      }

      // Ensure we are updating a PENDING record
      if (existingRegistration.status !== RecipientStatus.PENDING) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot update registration with status: ${existingRegistration.status}`,
          },
          { status: 409 }, // Conflict - already approved/rejected etc.
        );
      }

      // Update the existing record to APPROVED
      const updatedRegistration = await prisma.roundCampaigns.update({
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
      return NextResponse.json(
        { success: true, data: updatedRegistration },
        { status: 200 },
      );
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
        return NextResponse.json(
          {
            success: false,
            message: message,
            status: existingRegistration.status,
          },
          { status: 409 }, // Conflict
        );
      }

      // Create a new registration record with PENDING status
      const newRegistration = await prisma.roundCampaigns.create({
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
      return NextResponse.json(
        { success: true, data: newRegistration },
        { status: 201 },
      ); // 201 Created
    }
  } catch (error: unknown) {
    console.error('Error in /api/rounds/recipients/register:', error);
    let errorMessage = 'An internal server error occurred.';
    let statusCode = 500;

    // Check specifically for Prisma unique constraint violation
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      errorMessage =
        'A registration record for this campaign and round already exists.';
      statusCode = 409; // Conflict
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode },
    );
  }
}
