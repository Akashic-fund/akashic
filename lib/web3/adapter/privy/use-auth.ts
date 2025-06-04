import { useCallback, useMemo, useState } from 'react';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import {
  getSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { IWeb3UseAuthHook } from '@/lib/web3/types';
import { useSession } from 'next-auth/react';

export function useAuth(): IWeb3UseAuthHook {
  const { user, ready, logout: privyLogout, getAccessToken } = usePrivy();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const params = useSearchParams();
  const callbackUrl = params?.get('callbackUrl') || '/dashboard';
  const address = useMemo(() => {
    if (typeof user?.wallet?.address === 'string') {
      return user.wallet.address.toLowerCase();
    }
    return undefined;
  }, [user?.wallet?.address]);
  const session = useSession();
  const { login: privyLogin } = useLogin({
    onComplete: async (privyParams) => {
      // this method is called on every page-load to indicate that privy login
      // was completed. Do nothing if we already acquired the next-auth token
      if (session.status === 'authenticated') {
        setAuthenticated(true);
        return;
      }
      try {
        const accessToken = await getAccessToken();
        // according to privy, the user may sign in with email/sms/whatever and
        // then the application provides a easy interface to setup a wallet
        // therefore no wallet may be available. We are using privy sorely to
        // sign in with metamask and in development any token validation
        // is bypassed to let next-auth trust the address we send. That way
        // any user (in development) may authenticate as any wallet-address
        const address = privyParams?.user?.wallet?.address;
        let authResult = undefined;
        if (process.env.NODE_ENV === 'production') {
          // in production the server can validate the access token
          // acquire the user & their wallet and optionally create their wallet
          authResult = await nextAuthSignIn('privy-token', {
            redirect: false,
            token: accessToken,
            redirectTo: callbackUrl,
          });
        } else {
          // in development its assumed that privy login is only with metamask
          // when logging in with a privy-user without a wallet, this will fail
          if (!address) {
            throw new Error(
              'An error occured with the signin on privy: no wallet address returned',
            );
          }
          authResult = await nextAuthSignIn('privy-fake', {
            redirect: false,
            address,
            redirectTo: callbackUrl,
          });
        }
        if (authResult?.ok && !authResult.error) {
          const session = await getSession();
          console.info('User signed in:', session?.user?.name);
          setAuthenticated(true);
        } else if (authResult?.error) {
          const errorMessage =
            'An error occurred while signin in.' +
            ` Code: ${authResult.status} - ${authResult.error}`;
          console.error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        logout();
      }
    },
  });
  const login = useCallback(async () => {
    privyLogin();
  }, [privyLogin]);
  const logout = useCallback(async () => {
    await privyLogout();
    await nextAuthSignOut({ redirect: false });
    router.push('/');
  }, [privyLogout, router]);
  return {
    address,
    authenticated,
    ready,
    login,
    logout,
  };
}
