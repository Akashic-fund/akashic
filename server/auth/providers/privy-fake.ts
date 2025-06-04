import CredentialsProvider from 'next-auth/providers/credentials';

import { type User } from 'next-auth';
import { setupUser, handleError } from './common';

export function PrivyFakeProvider() {
  return CredentialsProvider({
    name: 'privy-fake',
    id: 'privy-fake',
    credentials: {
      address: {
        label: 'Address',
        type: 'text',
        placeholder: '0x....',
      },
    },
    async authorize(credentials): Promise<User | null> {
      try {
        if (typeof credentials?.address !== 'string') {
          throw new Error('PrivyFakeAddress is undefined');
        }
        const { address } = credentials;
        console.warn(
          'PrivyFake Authentication used that bypasses any token verification and just assumes the wallet-address',
        );
        if (process.env.NODE_ENV !== 'development') {
          throw new Error(
            'PrivyFake Authentication must not be used in production',
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
