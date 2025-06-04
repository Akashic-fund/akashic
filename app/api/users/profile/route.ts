import { db } from '@/server/db';
import { checkAuth } from '@/lib/api/auth';
import { ApiIntegrityError } from '@/lib/api/error';
import { response, handleError } from '@/lib/api/response';

export async function POST(req: Request) {
  try {
    const session = await checkAuth(['user']);
    const { lastName, firstName, username, bio, recipientWallet } =
      await req.json();

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await db.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.address !== session.user.address) {
        throw new ApiIntegrityError('Username is already taken');
      }
    }

    // Find or create the user
    const user = await db.user.update({
      where: { address: session.user.address },
      data: {
        firstName,
        lastName,
        username,
        ...(recipientWallet && { recipientWallet }),
        bio,
      },
    });

    return response({
      success: true,
      user,
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
