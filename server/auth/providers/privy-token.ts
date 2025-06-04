import CredentialsProvider from 'next-auth/providers/credentials';

import { type User } from 'next-auth';
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from '@/lib/constant';
import { PrivyClient } from '@privy-io/server-auth';
import { setupUser, handleError } from './common';

export function PrivyTokenProvider() {
  return CredentialsProvider({
    name: 'privy-token',
    id: 'privy-token',
    credentials: {
      token: {
        label: 'Token',
        type: 'text',
        placeholder: 'ey...',
      },
    },
    async authorize(credentials): Promise<User | null> {
      try {
        if (typeof credentials?.token !== 'string') {
          throw new Error('PrivyToken is undefined');
        }
        const { token } = credentials;
        let address: string | undefined = undefined;
        try {
          const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
          const verifiedClaims = await privy.verifyAuthToken(token);
          const userId = verifiedClaims.userId;
          let user = await privy.getUserById(userId);
          if (!user.wallet) {
            user = await privy.createWallets({
              userId,
              createEthereumWallet: true,
            });
          }
          address = user.wallet?.address;
        } catch (error) {
          throw new Error(
            `Token verification & wallet retrieval failed with error ${error}.`,
          );
        }
        if (!address) {
          throw new Error(`No address received.`);
        }
        return await setupUser(address);
      } catch (error: unknown) {
        handleError(error);
      }
      return null;
    },
  });
}
