import { db } from '@/server/db';
import { checkAuth, isAdmin } from '@/lib/api/auth';
import {
  ApiAuthNotAllowed,
  ApiIntegrityError,
  ApiNotFoundError,
  ApiParameterError,
} from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

export async function POST() {
  // optional, define your params in /lib/api/types/**
  // { params }:TYPEParams,
  try {
    const session = await checkAuth(['user']);
    // optional:
    // const data: PostTYPEBody = req.json()
    const user = await db.user.findUnique({
      where: {
        address: session.user.address,
      },
    });
    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    if (!user.id) {
      throw new ApiParameterError('Missing required parameters');
    }
    if (!user.id) {
      throw new ApiIntegrityError('User stored in database is invalid');
    }
    if (!isAdmin()) {
      throw new ApiAuthNotAllowed('Need to be a admin');
    }
    return response(user);
  } catch (error: unknown) {
    return handleError(error);
  }
}
