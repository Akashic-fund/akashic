import type { Prisma } from '@/.generated/prisma/client';

// Use Prisma's generated types to build upon
// This defines a type for a Round record including the count of roundCampaigns
export type RoundWithCount = Prisma.RoundGetPayload<
  Prisma.RoundDefaultArgs & {
    include: { _count: { select: { roundCampaigns: true } } };
  }
>;

// Infer the payload type from the validator
export type RoundPayload = Prisma.RoundGetPayload<
  Prisma.RoundDefaultArgs & {
    include: { _count: { select: { roundCampaigns: true } } };
  }
>;

// Define the final Round type used in components
// Omit the original Decimal matchingPool and replace it with number
// Ensure all other necessary fields from RoundPayload are included
export interface Round extends Omit<RoundPayload, 'matchingPool'> {
  id: number; // Ensure ID type is correct (number based on schema)
  matchingPool: number; // Overwrite Decimal with number
  // Ensure Date types are correctly inferred from RoundPayload for:
  // startDate: Date;
  // endDate: Date;
  // applicationStart: Date;
  // applicationClose: Date;
  // createdAt: Date;
  // updatedAt: Date;

  // _count is already included from RoundPayload
  // _count: {
  //   roundCampaigns: number;
  // };

  // Add any other fields explicitly if needed, though RoundPayload should cover them
  // title: string;
  // description: string;
  // etc...
}

import type { Round as PrismaRound } from '@/.generated/prisma/client';

// Define and export the status map
export const ROUND_STATUS_MAP = {
  NOT_STARTED: { text: 'Not Started', color: 'bg-gray-100 text-gray-800' },
  APPLICATION_OPEN: {
    text: 'Applications Open',
    color: 'bg-blue-100 text-blue-800',
  },
  APPLICATION_CLOSED: {
    text: 'Applications Closed',
    color: 'bg-yellow-100 text-yellow-800',
  },
  ACTIVE: { text: 'Active', color: 'bg-green-100 text-green-800' },
  ENDED: { text: 'Ended', color: 'bg-red-100 text-red-800' },
  UNKNOWN: { text: 'Unknown', color: 'bg-gray-100 text-gray-800' },
} as const; // Use 'as const' for stricter typing

// Define and export the status key type
export type RoundStatusKey = keyof typeof ROUND_STATUS_MAP;

// Define and export the status calculation function
export function getRoundStatus(round: PrismaRound): RoundStatusKey {
  const now = new Date();
  if (now < round.applicationStart) return 'NOT_STARTED';
  if (now >= round.applicationStart && now < round.applicationClose)
    return 'APPLICATION_OPEN';
  if (now >= round.applicationClose && now < round.startDate)
    return 'APPLICATION_CLOSED';
  if (now >= round.startDate && now < round.endDate) return 'ACTIVE';
  if (now >= round.endDate) return 'ENDED';
  return 'UNKNOWN'; // Fallback
}

// You might want other round-related types here too
export enum RecipientStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
