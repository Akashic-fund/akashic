/**
 * Api Mock for development
 * this is used in client to prevent 3rd party requests
 * usage:
 *   client: `enableApiMock = true`
 *     overwrites the browser-fetch with the mockFetch handling certain requests
 *     this is for any component that calls fetch(....) in a callback
 */
import { enableApiMock } from './index';

export async function mockFetch(
  url: string | URL | Request,
  options: RequestInit,
): Promise<Response> {
  console.log('developer mock fetch', { url, options });
  if (typeof url === 'string') {
    // Handle Crowdsplit API endpoints
    if (url === '/api/crowdsplit/customers') {
      return new Response(JSON.stringify({ data: { id: 'mock-customer-id' } }));
    }
    if (url === '/api/crowdsplit/payments') {
      return new Response(
        JSON.stringify({ data: { id: 'mock-transaction-id' } }),
      );
    }
    if (url.includes('/api/crowdsplit/payments') && url.includes('/confirm')) {
      return new Response(
        JSON.stringify({
          data: {
            metadata: {
              public_key: 'mock-public-key',
              client_secret: 'mock_secret_mocksecret',
            },
          },
        }),
      );
    }
    if (url.startsWith('/api/crowdsplit')) {
      if (url.startsWith('/api/crowdsplit/kyc/status')) {
        return new Response(JSON.stringify({ status: 'completed' }));
        return new Response(JSON.stringify({ status: 'pending' }));
        return new Response(JSON.stringify({ status: 'failed' }));
        return new Response(JSON.stringify({ status: '--default--' }));
      }
      if (url.startsWith('/api/crowdsplit/kyc/initiate')) {
        return new Response(JSON.stringify({ redirectUrl: '/' }));
      }
    }
  }
  if (
    typeof window !== 'undefined' &&
    // @ts-expect-error: local developer hack to mock fetches
    typeof window.original_fetch === 'function'
  ) {
    // @ts-expect-error: local developer hack to mock fetches
    return window.original_fetch(url, options);
  }
  return fetch(url, options);
}
// react/client fetch overwrite
if (typeof window !== 'undefined' && enableApiMock) {
  // @ts-expect-error: local developer hack to mock fetches
  window.original_fetch = fetch;
  // @ts-expect-error: local developer hack to mock fetches
  window.fetch = mockFetch;
}
