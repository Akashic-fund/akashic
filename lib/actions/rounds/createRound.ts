'use server';

import { z } from 'zod';
import { type Address, type Hash } from 'viem';
import { db, PrismaClientKnownRequestError } from '@/server/db';
import { type ActionResponse } from '@/types/actions';
import { checkAuth } from '@/lib/api/auth';

// Schema for the data coming *from the form*
const roundFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(30),
  matchingPool: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Matching pool must be a non-negative number.',
    }),
  tokenAddress: z
    .string()
    .refine((val): val is Address => /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid token address format.',
    }),
  tokenDecimals: z.coerce.number().int().min(0).max(18),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date.',
  }),
  endDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date.' }),
  applicationStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid application start date.',
  }),
  applicationClose: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid application close date.',
  }),
  logoUrl: z.string().url().optional().or(z.literal('')),
  profileId: z
    .string()
    .refine((val): val is Hash => /^0x[a-fA-F0-9]{64}$/.test(val), {
      message: 'Invalid Profile ID format (bytes32).',
    }),
  tags: z.array(z.string()).optional(),
});

// Schema for the data required by the *server action*
const saveRoundActionSchema = roundFormSchema.extend({
  poolId: z.bigint(),
  transactionHash: z
    .string()
    .refine((val): val is Hash => /^0x[a-fA-F0-9]{64}$/.test(val), {
      message: 'Invalid Transaction Hash format.',
    }),
  strategyAddress: z
    .string()
    .refine((val): val is Address => /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: 'Invalid strategy address format.',
    }),
  blockchain: z
    .string()
    .min(1, { message: 'Blockchain identifier is required.' }),
});

type SaveRoundActionInput = z.infer<typeof saveRoundActionSchema>;

// Define a standard response type
type SaveRoundActionResult = ActionResponse<{ roundId: number } | null> & {
  message?: string;
};

export async function saveRoundAction(
  input: SaveRoundActionInput,
): Promise<SaveRoundActionResult> {
  try {
    const session = await checkAuth(['admin']);
    const validationResult = saveRoundActionSchema.safeParse(input);
    if (!validationResult.success) {
      console.error(
        'Server Action: Save Round Validation failed',
        validationResult.error.flatten().fieldErrors,
      );
      return {
        success: false,
        error: 'Invalid data received by server.',
        fieldErrors: validationResult.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const data = validationResult.data;
    console.log('Server Action: Saving round data to DB:', data);

    // Prepare data for Prisma
    const prismaData = {
      poolId: data.poolId,
      strategyAddress: data.strategyAddress,
      profileId: data.profileId,
      managerAddress: session.user.address,
      transactionHash: data.transactionHash,
      title: data.title,
      description: data.description,
      matchingPool: Number(data.matchingPool),
      tokenAddress: data.tokenAddress,
      tokenDecimals: data.tokenDecimals,
      applicationStart: new Date(data.applicationStart),
      applicationClose: new Date(data.applicationClose),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      logoUrl: data.logoUrl || null,
      blockchain: data.blockchain,
      tags:
        Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['web3'],
    };

    // Use Prisma to create the round record
    const newRound = await db.round.create({
      data: prismaData,
    });

    console.log(
      'Server Action: Round saved successfully with ID:',
      newRound.id,
    );
    return {
      success: true,
      data: { roundId: newRound.id },
    };
  } catch (error: unknown) {
    console.error(
      'Error saving round to database:',
      error instanceof Error ? error.message : String(error),
    );

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const target = (error.meta as { target?: string[] | string })?.target;
        const targetString = Array.isArray(target) ? target.join(', ') : target;

        const errorMessage = targetString
          ? `A round with this ${targetString} already exists.`
          : 'This transaction or pool ID has already been recorded.';

        return {
          success: false,
          error: errorMessage,
        };
      }
    }

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred while saving the round.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
