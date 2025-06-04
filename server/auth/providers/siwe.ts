import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

import { SiweMessage } from 'siwe';
import { setupUser, handleError } from './common';
import { type User } from 'next-auth';

const nextAuthUrl =
  process.env.NEXTAUTH_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

export function SiweProvider() {
  return CredentialsProvider({
    name: 'siwe',
    id: 'siwe',
    credentials: {
      message: {
        label: 'Message',
        type: 'text',
        placeholder: '0x0',
      },
      signature: {
        label: 'Signature',
        type: 'text',
        placeholder: '0x0',
      },
    },
    async authorize(credentials): Promise<User | null> {
      try {
        console.log('authorize', { credentials });
        if (
          typeof credentials?.message !== 'string' ||
          typeof credentials?.signature !== 'string'
        ) {
          throw new Error('SiweMessage is undefined');
        }
        if (!nextAuthUrl) {
          throw new Error(
            'no nextAuthUrl (NEXTAUTH_URL,VERCEL_URL) - environment not configured correctly',
          );
        }

        const nextAuthHost = new URL(nextAuthUrl).host;

        // Get CSRF token from cookie using the new async approach
        const headerCookies = await cookies();
        const csrfToken = headerCookies.get('authjs.csrf-token');
        const nonce = csrfToken?.value.split('|')[0];
        const { message, signature } = credentials;
        const siwe = new SiweMessage(JSON.parse(message));
        if (siwe.domain !== nextAuthHost) {
          throw new Error('siwe.verify succeded but for a different domain');
        }
        if (siwe.nonce !== nonce) {
          throw new Error('siwe.verify succeded but for a different nonce');
        }
        const verificationParams = {
          signature,
        };
        const result = await siwe.verify(verificationParams);
        if (!result.success) {
          throw new Error('siwe.verify failed');
        }
        const address = siwe.address;
        return await setupUser(address);
      } catch (error: unknown) {
        handleError(error);
      }
      return null;
    },
  });
}
