import NextAuth from 'next-auth';
import { type NextRequest } from 'next/server';
import { cache } from 'react';

import { authConfig } from './config';

const {
  auth: uncachedAuth,
  handlers: authHandlers,
  signIn,
  signOut,
} = NextAuth(authConfig);

const auth = cache(uncachedAuth);

/**
 * Auth Get handler
 * redirects the user from the next-auth login page
 * in order to avoid displaying the different
 * auth mechanisms
 */
async function handleUiGET(req: Request) {
  // const requestUrl = new URL(req.url);
  // if (requestUrl.pathname === '/api/auth/signin') {
  //   // redirect to home, there is no signin page
  //   const homeUrl = new URL(process.env.NEXTAUTH_URL ?? req.url);
  //   return NextResponse.redirect(homeUrl);
  // }
  return authHandlers.GET(req as unknown as NextRequest);
}

const handlers = {
  POST: authHandlers.POST,
  GET: handleUiGET,
};

export { auth, handlers, signIn, signOut };
