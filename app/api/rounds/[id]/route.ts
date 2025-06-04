import { db } from '@/server/db';
import { ApiNotFoundError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';
import { RoundsWithIdParams } from '@/lib/api/types';

export async function GET(req: Request, { params }: RoundsWithIdParams) {
  try {
    // public endpoint

    const id = (await params).id; // Get the ID from the query parameters

    const round = await db.round.findUnique({
      where: { id: Number(id) }, // Fetch the round by ID
    });

    if (!round) {
      throw new ApiNotFoundError('User not found');
    }

    return response(round);
  } catch (error: unknown) {
    return handleError(error);
  }
}
