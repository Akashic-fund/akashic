import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

export async function GET() {
  try {
    const session = await checkAuth(['user']);

    const user = await db.user.findUnique({
      where: { address: session.user.address },
    });

    if (!user) {
      throw new ApiNotFoundError('User not found');
    }
    return response(user);
  } catch (error: unknown) {
    return handleError(error);
  }
}
