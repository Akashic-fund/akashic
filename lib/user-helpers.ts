import { prisma } from '@/lib/prisma';

/**
 * Ensures a user exists in the database, creating them if necessary
 * @param userAddress The user's wallet address
 * @returns The user object
 */
export async function ensureUserExists(userAddress: string) {
  console.log('Ensuring user exists:', userAddress);

  if (!userAddress) {
    throw new Error('User address is required');
  }

  try {
    // Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: {
        address: userAddress,
      },
    });

    // If user doesn't exist, create them
    if (!user) {
      console.log("User doesn't exist, creating new user:", userAddress);

      // Create user with only the fields that exist in the schema
      // Note: We're not using the 'name' field as it doesn't exist in your schema
      user = await prisma.user.create({
        data: {
          address: userAddress,
          // No name field in the schema
        },
      });
      console.log('User created:', user);
    }

    return user;
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    throw error;
  }
}
