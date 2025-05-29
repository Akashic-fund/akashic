import { v4 as uuidv4 } from 'uuid';
import { CROWDSPLIT_API_URL } from '@/lib/constant';
/**
 * Api Mock for development
 * this is used in server to prevent 3rd party requests
 * usage:
 *   import {apiFetch} from './api-fetch'
 *   ... instead of fetch(...) use apiFetch(...)
 */
export async function apiFetch(
  url: string | URL | Request,
  options: RequestInit,
): Promise<Response> {
  console.log('developer mock fetch', { url, options });
  if (typeof url === 'string') {
    if (CROWDSPLIT_API_URL && url.includes(CROWDSPLIT_API_URL)) {
      // crowdsplit requests
      if (url.endsWith('/api/v1/merchant/token/grant')) {
        return new Response(JSON.stringify({ access_token: uuidv4() }));
      }
      if (url.includes('/api/v1/customers')) {
        if (url.endsWith('/api/v1/customers') && options.method === 'POST') {
          return new Response(
            JSON.stringify({ id: 'mock-customer-id' + uuidv4() }),
          );
        }
        if (url.endsWith('payment_methods') && options.method === 'POST') {
          return new Response(
            JSON.stringify({
              id: 'mock-payment-method-id' + uuidv4(),
            }),
          );
        }
        if (url.includes('/payment_methods/') && options.method === 'DELETE') {
          return new Response(
            JSON.stringify({
              id: 'mock-payment-method-id' + uuidv4(),
            }),
          );
        }
        if (url.includes('/payment_methods/') && options.method === 'GET') {
          return new Response(
            JSON.stringify({
              id: url.replace(/.*\//, ''), // return the requested id
              type: 'MOCK-CROWDSPLIT',
              bank_details: {
                bank_name: 'MOCK-BANK-NAME',
                account_number: 'MOCK-ACCOUNT-NUMBER',
                routing_number: 'MOCK-ROUTING-NUMBER',
                account_type: 'MOCK-ACCOUNT-TYPE',
                account_name: 'MOCK-ACCOUNT-NAME',
              },
            }),
          );
        }
        if (url.endsWith('wallets') && options.method === 'POST') {
          return new Response(
            JSON.stringify({
              success: true,
            }),
          );
        }
      }
      if (url.includes('/api/v1/kyc')) {
        if (url.endsWith('schema?provider=CROWDSPLIT')) {
          return new Response(
            JSON.stringify({ data: { error: 'unknown-response-type' } }),
          );
        }
        if (url.endsWith('initiate?provider=CROWDSPLIT')) {
          return new Response(JSON.stringify({ redirectUrl: '/' }));
        }
        if (url.endsWith('status?provider=CROWDSPLIT')) {
          return new Response(JSON.stringify({ status: 'completed' }));
          return new Response(JSON.stringify({ status: 'pending' }));
          return new Response(JSON.stringify({ status: 'failed' }));
          return new Response(JSON.stringify({ status: '--default--' }));
        }
      }
    }
    if (url.endsWith('/api/v1/payments') && options.method === 'POST') {
      return new Response(
        JSON.stringify({ data: { id: 'mock-transaction-id' + uuidv4() } }),
      );
    }
    if (url.includes('/api/v1/payments') && url.endsWith('confirm')) {
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
  }
  console.log('using original service');
  return fetch(url, options);
}
