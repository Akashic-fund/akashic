import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import {
  ApiAuthNotAllowed,
  ApiNotFoundError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

export async function GET() {
  try {
    const rounds = await db.round.findMany(); // Fetch all rounds from the database
    return response(rounds);
  } catch (error: unknown) {
    return handleError(error);
  }
}

// New POST handler
export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const body = await req.json();

    const {
      title,
      description,
      tags,
      matchingPool,
      applicationStart,
      applicationClose,
      startDate,
      endDate,
      status,
      blockchain,
      logoUrl,
    } = body;

    // Check if any required fields are missing
    if (
      !title ||
      !description ||
      !tags ||
      !matchingPool ||
      !applicationStart ||
      !applicationClose ||
      !startDate ||
      !endDate ||
      !blockchain ||
      !logoUrl
    ) {
      throw new ApiParameterError('Missing required parameters');
    }

    // Validate status against enum values
    const validStatuses = ['NOT_STARTED', 'ACTIVE', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      throw new ApiParameterError('Invalid status value');
    }

    const newRound = await db.round.create({
      data: {
        title: title,
        description: description,
        tags: tags as string[],
        matchingPool: parseInt(matchingPool),
        applicationStart: new Date(applicationStart),
        applicationClose: new Date(applicationClose),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        blockchain,
        logoUrl,
        strategyAddress: body.strategyAddress || '0x0',
        profileId: body.profileId || 'default-profile',
        managerAddress: session.user.address,
        tokenAddress: body.tokenAddress || '0x0',
        tokenDecimals: body.tokenDecimals || 18,
      },
    });
    return response(newRound);
  } catch (error: unknown) {
    return handleError(error);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const { id, title, description, tags, matchingPool, startDate, endDate } =
      await req.json();
    const instance = await db.round.findUnique({ where: { id } });
    if (!instance) {
      throw new ApiNotFoundError('User not found');
    }
    if (instance.managerAddress !== session.user.address) {
      throw new ApiAuthNotAllowed(
        'Only the creator of the round may modify it',
      );
    }
    const updatedRound = await db.round.update({
      where: { id },
      data: {
        title,
        description,
        tags,
        matchingPool: parseInt(matchingPool, 10),
        applicationStart: new Date(startDate),
        applicationClose: new Date(endDate),
      },
    });
    return response(updatedRound);
  } catch (error: unknown) {
    return handleError(error);
  }
}
