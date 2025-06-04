import { headers } from 'next/headers';
import { ADMIN_ADDRESS } from '@/lib/constant';
import { enableBypassContractAdmin } from '@/lib/develop';
import { auth } from '@/server/auth';
import { type Session } from 'next-auth';
import { ApiAuthError, ApiAuthNotAllowed } from './error';

/**
 * check authorization
 * use next-auth to acquire session and consider the session-role with the given roles.
 * returns the session if one of the roles given is in the current session
 * returns null if no role was requested
 * throws if the none of the roles matches
 */
export async function checkAuth(roles: string[]) {
  if (!Array.isArray(roles) || !roles.length) {
    throw new Error('checkAuth: invalid roles parameter');
  }
  const session = await auth();
  if (!session) {
    throw new ApiAuthError('No session');
  }
  if (!Array.isArray(session.user?.roles)) {
    throw new ApiAuthError('Invalid session');
  }
  if (session.user.roles.length) {
    for (const role of roles) {
      if (session.user.roles.includes(role)) {
        return session;
      }
    }
  }
  // roles are requested but not available in session
  throw new ApiAuthError(
    'Current session does not qualify for requested role(s)',
  );
}

/**
 * IsAdmin: evaluates if the current header belongs to a user
 *          that has been marked as admin
 */
export async function isAdmin() {
  const session = await auth();
  if (session?.user?.roles?.includes('admin')) {
    return true;
  }
  return false;
}
/**
 * IsContractAdmin: evaluates if the current header belongs to a user
 *          that has been marked as admin AND her address is known to
 *          to our contracts.
 */
export async function checkContractAdmin(session: Session) {
  const requestUserAddress = session.user.address;
  if (!enableBypassContractAdmin) {
    if (
      !requestUserAddress ||
      requestUserAddress.toLowerCase() !== ADMIN_ADDRESS?.toLowerCase()
    ) {
      throw new ApiAuthNotAllowed(
        'address is not registered as admin for contracts',
      );
    }
  }
  return true;
}
/**
 * IsUser: evaluates if the current header belongs to a user
 *         that been authorized by a identity provider.
 */
export async function isUser() {
  // const accessToken = (await headers())
  //   .get('authorization')
  //   ?.replace('Bearer ', '');
  // parse access token, get user-address?
  const requestUserAddress = (await headers()).get('x-user-address');
  if (!requestUserAddress) {
    throw new ApiAuthNotAllowed('Missing user address');
  }

  return true;
}

/**
 * IsOwner: evaluates if the given resource may be modified by the current
 *          authenticated user
 */
export async function isOwner(id: string | number, collectionName: string) {
  console.log({ id, collectionName });
  return true;
}
/**
 * canRead: evaluates if the given resource may be read by the current
 *          authenticated user
 */
export async function canRead(id: string | number, collectionName: string) {
  console.log({ id, collectionName });
  return true;
}
