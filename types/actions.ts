import { type Hash } from 'viem';

export interface ActionResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string; // General server/action error message
  fieldErrors?: Record<string, string[]>; // Zod validation errors
  // Add other potential fields like validationErrors for non-zod issues if needed
}

// Specific response type for createRound
export interface CreateRoundSuccessData {
  transactionHash: Hash;
}

export type CreateRoundActionResponse = ActionResponse<CreateRoundSuccessData>;
