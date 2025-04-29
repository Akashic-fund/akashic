// Create a service to interact with Bridge API endpoints
// import { headers } from 'next/headers';
import {BRIDGE_API_URL, BRIDGE_API_KEY} from '@/lib/constant';

if (!BRIDGE_API_URL) {
  throw new Error('BRIDGE_API_URL is not defined in environment variables');
}

if (!BRIDGE_API_KEY) {
  throw new Error('BRIDGE_API_KEY is not defined in environment variables');
}

// Define types for payment method operations
interface BankDetails {
  provider: "BRIDGE";
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  accountName: string;
}

interface PaymentMethodRequest {
  customerId: string;
  type: string;
  bank_details: BankDetails;
}

interface PaymentMethodResponse {
  id: string;
  type: string;
  // Other response fields
}

export interface BridgeTransactionResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

export class BridgeService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    // Clean the API key by trimming whitespace and removing quotes
    this.apiKey = apiKey.trim().replace(/['"]/g, '');
    
    console.log('Initialized Bridge service with API URL:', apiUrl);
    console.log('API key length:', this.apiKey.length);
    // Log a masked version of the key for debugging
    if (this.apiKey.length > 8) {
      console.log('API key format check:', 
        `${this.apiKey.substring(0, 4)}...${this.apiKey.substring(this.apiKey.length - 4)}`);
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    
    // Check if API key exists
    if (!this.apiKey) {
      console.error('Bridge API key is missing');
      throw new Error('API key is required for Bridge API calls');
    }
    
    // Clean the API key
    const cleanApiKey = this.apiKey.trim();
    
    const headers = {
      'Content-Type': 'application/json',
      // Try without Bearer prefix
      'Authorization': cleanApiKey,
    };
    
    console.log(`Making ${method} request to ${url}`);
    
    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, options);
      
      // For debugging purposes
      const responseText = await response.text();
      console.log(`Bridge API response [${response.status}]:`, responseText || '(empty response)');
      
      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error parsing response:', e);
        responseData = { rawResponse: responseText };
      }
      
      // Log specific error for 401 unauthorized
      if (response.status === 401) {
        console.error('Bridge API authorization failed:', responseData);
        throw new Error(`Bridge API authorization failed: ${responseText || 'No error details provided'}`);
      }
      
      if (!response.ok) {
        console.error(`Bridge API error (${response.status}):`, responseData);
        throw new Error(
          responseData.message || 
          responseData.error || 
          `Bridge API error: ${response.status} ${response.statusText}`
        );
      }

      return responseData;
    } catch (error) {
      console.error(`Error in Bridge API call to ${url}:`, error);
      throw error;
    }
  }

  async createCustomer(customerData: {
    first_name: string;
    last_name: string;
    email: string;
    [key: string]: unknown;
  }) {
    console.log('Creating customer with data:', customerData);
    return this.request('/api/v1/customers', 'POST', customerData);
  }

  async getKycSchema() {
    return this.request('/api/v1/kyc/schema?provider=BRIDGE');
  }

  async initiateKyc(customerId: string) {
    return this.request(`/api/v1/kyc/${customerId}/initiate?provider=BRIDGE`);
  }

  async getKycStatus(customerId: string) {
    return this.request(`/api/v1/kyc/${customerId}/status?provider=BRIDGE`);
  }

  async createPaymentMethod(data: PaymentMethodRequest): Promise<PaymentMethodResponse> {
    console.log('Creating payment method with data:', {
      customerId: data.customerId,
      type: data.type,
      bank_details: {
        ...data.bank_details,
        accountNumber: '****' + data.bank_details.accountNumber.slice(-4) // Log safely
      }
    });
    
    // The payload should match exactly the expected format
    const payload = {
      type: data.type,
      bank_details: data.bank_details
    };
    
    console.log('Bridge API payload:', JSON.stringify(payload));
    
    // The correct endpoint format according to Bridge API docs
    return this.request<PaymentMethodResponse>(
      `/api/v1/customers/${data.customerId}/payment_methods`, 
      'POST', 
      payload
    );
  }

  // async deletePaymentMethod(paymentMethodId: string, customerId: string): Promise<void> {
  //   return this.request<void>(`/api/v1/customers/${customerId}/payment_methods/${paymentMethodId}`, 'DELETE');
  // }

  async buyTransaction(data: {
    customerId: string;
    fiatCurrency: string;
    cryptoCurrency: string;
    fiatAmount: number;
    paymentMethodId: string;
    walletAddress: string;
  }): Promise<BridgeTransactionResponse> {
    // Map our params to Bridge API expected format
    const payload = {
      customer_id: data.customerId,
      currency: data.fiatCurrency,
      crypto_currency: data.cryptoCurrency,
      amount: data.fiatAmount,
      payment_method_id: data.paymentMethodId,
      wallet_address: data.walletAddress,
      provider: "BRIDGE"
    };
    
    return this.request<BridgeTransactionResponse>('/api/v1/wallets/trades/buy', 'POST', payload);
  }

  async sellTransaction(data: {
    customerId: string;
    fiatCurrency: string;
    cryptoCurrency: string;
    cryptoAmount: number;
    walletAddress: string;
    [key: string]: unknown;
  }): Promise<BridgeTransactionResponse> {
    // Create a properly formatted payload for the Bridge API
    const payload = {
      customer_id: data.customerId,
      currency: data.fiatCurrency,
      crypto_currency: data.cryptoCurrency,
      amount: data.cryptoAmount,
      wallet_address: data.walletAddress,
      provider: "BRIDGE"
    };
    
    return this.request<BridgeTransactionResponse>('/api/v1/wallets/trades/sell', 'POST', payload);
  }
}

export const bridgeService = new BridgeService(BRIDGE_API_URL, BRIDGE_API_KEY); 