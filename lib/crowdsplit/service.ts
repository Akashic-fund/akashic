// A service to interact with Crowdsplit API endpoints

import {
  CROWDSPLIT_API_URL,
  CROWDSPLIT_CLIENT_ID,
  CROWDSPLIT_CLIENT_SECRET,
  CROWDSPLIT_WEBHOOK_SECRET,
} from '@/lib/constant';
import { apiFetch } from './api-fetch';
import {
  CrowdsplitAssociateWalletInterface,
  CrowdsplitAssociateWalletResponse,
  CrowdsplitCreateCustomerInterface,
  CrowdsplitCreateCustomerRequest,
  CrowdsplitCreateCustomerResponse,
  CrowdsplitCreateDonationCustomerInterface,
  CrowdsplitCreateDonationCustomerRequest,
  CrowdsplitCreateDonationCustomerResponse,
  CrowdsplitInitiateKycResponse,
  CrowdsplitKycStatusResponse,
  CrowdsplitPaymentMethodCreateInterface,
  CrowdsplitPaymentMethodCreateResponse,
  CrowdsplitPaymentMethodCreateResponseInterface,
  CrowdsplitPaymentMethodGetInterface,
  CrowdsplitPaymentMethodGetResponse,
  CrowdsplitCreatePaymentInterface,
  CrowdsplitCreatePaymentPostRequest,
  CrowdsplitCreatePaymentPostResponse,
  CrowdsplitConfirmPaymentInterface,
  CrowdsplitConfirmPaymentPostResponse,
  CrowdsplitTransactionBuyInterface,
  CrowdsplitTransactionResponse,
  CrowdsplitTransactionSellInterface,
} from './types';
import crypto from 'crypto';
const debug = false;

if (!CROWDSPLIT_API_URL) {
  throw new Error('CROWDSPLIT_API_URL is not defined in environment variables');
}

if (!CROWDSPLIT_CLIENT_ID) {
  throw new Error(
    'CROWDSPLIT_CLIENT_ID is not defined in environment variables',
  );
}
if (!CROWDSPLIT_CLIENT_SECRET) {
  throw new Error(
    'CROWDSPLIT_CLIENT_SECRET is not defined in environment variables',
  );
}

// types for payment method operations

export class CrowdsplitService {
  private readonly apiUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor(apiUrl: string, clientId: string, clientSecret: string) {
    this.apiUrl = apiUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    debug &&
      console.log('Initialized Crowdsplit service with API URL:', apiUrl);
  }
  /**
   * Make an authenticated request to Crowdsplit API
   * @param endpoint The API endpoint (without the base URL)
   * @param options Fetch options
   * @returns The fetch response
   */

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown,
  ): Promise<T> {
    // Get a fresh token for each request
    const token = await this.getToken();

    const url = `${this.apiUrl}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await apiFetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        console.error(`Crowdsplit API error (${response.status}):`, data);
        throw new Error(
          data.message ||
            data.error ||
            `Crowdsplit API error: ${response.status} ${response.statusText}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`Error in Crowdsplit API call to ${url}:`, error);
      throw error;
    }
  }
  /**
   * Get an access token from Crowdsplit API
   * @returns The access token
   */
  private async getToken() {
    try {
      const response = await apiFetch(
        `${this.apiUrl}/api/v1/merchant/token/grant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get Crowdsplit token');
      }

      const { access_token } = await response.json();
      return access_token;
    } catch (error) {
      console.error('Crowdsplit token error:', error);
      throw new Error(
        `Failed to get Crowdsplit token: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );
    }
  }
  async createCustomer(customerData: CrowdsplitCreateCustomerInterface) {
    const payload = {
      first_name: customerData.firstName,
      last_name: customerData.lastName,
      email: customerData.email,
      document_type: customerData.documentType,
      document_number: customerData.documentNumber,
      dob: customerData.dob,
      street_number: customerData.streetNumber,
      street_name: customerData.streetName,
      neighborhood: customerData.neighborhood,
      city: customerData.city,
      state: customerData.state,
      address_country_id: customerData.addressCountryId,
      postal_code: customerData.postalCode,
      phone_country_code: customerData.phoneCountryCode,
      phone_area_code: customerData.phoneAreaCode,
      phone_number: customerData.phoneNumber,
    } as CrowdsplitCreateCustomerRequest;
    const response = await this.request<CrowdsplitCreateCustomerResponse>(
      '/api/v1/customers',
      'POST',
      payload,
    );
    return response.data;
  }

  async createDonationCustomer(
    customerData: CrowdsplitCreateDonationCustomerInterface,
  ) {
    const payload = {
      email: customerData.email,
    } as CrowdsplitCreateDonationCustomerRequest;
    const response =
      await this.request<CrowdsplitCreateDonationCustomerResponse>(
        '/api/v1/customers',
        'POST',
        payload,
      );
    return response.data;
  }

  async initiateKyc(customerId: string) {
    return this.request<CrowdsplitInitiateKycResponse>(
      `/api/v1/kyc/${customerId}/initiate?provider=CROWDSPLIT`,
    );
  }

  async getKycSchema() {
    return this.request('/api/v1/kyc/schema?provider=CROWDSPLIT');
  }

  async getKycStatus(customerId: string) {
    return this.request<CrowdsplitKycStatusResponse>(
      `/api/v1/kyc/${customerId}/status?provider=CROWDSPLIT`,
    );
  }
  async getPaymentMethod(data: CrowdsplitPaymentMethodGetInterface) {
    const result = await this.request<CrowdsplitPaymentMethodGetResponse>(
      `/api/v1/customers/${data.customerId}/payment_methods/${data.id}`,
    );
    return {
      id: result.id,
      type: result.type,
      bankDetails: {
        bankName: result.bank_details.bank_name ?? '',
        accountNumber: result.bank_details.account_number ?? '',
        routingNumber: result.bank_details.routing_number ?? '',
        accountType: result.bank_details.account_type ?? '',
        accountName: result.bank_details.account_name ?? '',
      },
    } as CrowdsplitPaymentMethodCreateResponseInterface;
  }

  async createPaymentMethod(data: CrowdsplitPaymentMethodCreateInterface) {
    // The payload should match exactly the expected format
    const payload = {
      type: data.type,
      bank_details: {
        bank_name: data.bankDetails.bankName,
        account_number: data.bankDetails.accountNumber,
        routing_number: data.bankDetails.routingNumber,
        account_type: data.bankDetails.accountType,
        account_name: data.bankDetails.accountName,
      },
    };

    // The correct endpoint format according to Crowdsplit API docs
    return this.request<CrowdsplitPaymentMethodCreateResponse>(
      `/api/v1/customers/${data.customerId}/payment_methods`,
      'POST',
      payload,
    );
  }

  async deletePaymentMethod(
    paymentMethodId: string,
    customerId: string,
  ): Promise<void> {
    return this.request<void>(
      `/api/v1/customers/${customerId}/payment_methods/${paymentMethodId}`,
      'DELETE',
    );
  }
  async createPayment(data: CrowdsplitCreatePaymentInterface) {
    const payload: CrowdsplitCreatePaymentPostRequest = {
      amount: data.amount,
      currency: data.currency,
      customer_id: data.customerId,
      payment_method: data.paymentMethod,
      provider: data.provider,
    };
    const result = await this.request<CrowdsplitCreatePaymentPostResponse>(
      '/api/v1/payments',
      'POST',
      payload,
    );
    return result.data;
  }
  async confirmPayment(data: CrowdsplitConfirmPaymentInterface) {
    const payload = {};
    const result = await this.request<CrowdsplitConfirmPaymentPostResponse>(
      `/api/v1/payments/${data.id}/confirm`,
      'POST',
      payload,
    );
    return {
      clientSecret: result.data.metadata.client_secret,
      publicKey: result.data.metadata.public_key,
    };
  }

  async buyTransaction(data: CrowdsplitTransactionBuyInterface) {
    // Map our params to Crowdsplit API expected format
    const payload = {
      customer_id: data.customerId,
      currency: data.fiatCurrency,
      crypto_currency: data.cryptoCurrency,
      amount: data.fiatAmount,
      payment_method_id: data.paymentMethodId,
      wallet_address: data.walletAddress,
      provider: 'CROWDSPLIT',
    };

    return this.request<CrowdsplitTransactionResponse>(
      '/api/v1/wallets/trades/buy',
      'POST',
      payload,
    );
  }

  async sellTransaction(
    data: CrowdsplitTransactionSellInterface,
  ): Promise<CrowdsplitTransactionResponse> {
    // Create a properly formatted payload for the Crowdsplit API
    const payload = {
      customer_id: data.customerId,
      currency: data.fiatCurrency,
      crypto_currency: data.cryptoCurrency,
      amount: data.cryptoAmount,
      wallet_address: data.walletAddress,
      provider: 'CROWDSPLIT',
    };

    return this.request<CrowdsplitTransactionResponse>(
      '/api/v1/wallets/trades/sell',
      'POST',
      payload,
    );
  }

  async associatWallet(data: CrowdsplitAssociateWalletInterface) {
    // Map our params to Crowdsplit API expected format
    const payload = {
      wallet_address: data.walletAddress,
      wallet_type: data.walletType,
    };

    return this.request<CrowdsplitAssociateWalletResponse>(
      `/api/v1/customers/${data.customerId}/wallets`,
      'POST',
      payload,
    );
  }
  // Verify the Crowdsplit webhook signature
  verifySignature(signature: string | null, payload: string): boolean {
    if (process.env.NODE_ENV === 'development') {
      console.log('development: skipping signature verification');
      return true;
    }
    if (!CROWDSPLIT_WEBHOOK_SECRET) {
      console.warn(
        'Missing CROWDSPLIT_WEBHOOK_SECRET environment, unable to verify signatures',
      );
      return false;
    }
    if (!signature) {
      return false;
    }

    const hmac = crypto.createHmac('sha256', CROWDSPLIT_WEBHOOK_SECRET);
    const expectedSignature = hmac.update(payload).digest('hex');

    // Convert Buffers to Uint8Array objects for timingSafeEqual
    return crypto.timingSafeEqual(
      new Uint8Array(Buffer.from(signature)),
      new Uint8Array(Buffer.from(expectedSignature)),
    );
  }
}

export const crowdsplitService = new CrowdsplitService(
  CROWDSPLIT_API_URL,
  CROWDSPLIT_CLIENT_ID,
  CROWDSPLIT_CLIENT_SECRET,
);
