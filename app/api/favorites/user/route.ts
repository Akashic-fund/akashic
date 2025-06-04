import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { response, handleError } from '@/lib/api/response';

export async function GET() {
  try {
    const session = await checkAuth(['user']);

    const favorites = await db.favorite.findMany({
      where: {
        userAddress: session.user.address,
      },
      include: {
        campaign: {
          include: {
            images: true,
          },
        },
      },
    });

    return response({ favorites });
  } catch (error: unknown) {
    return handleError(error);
  }
}
