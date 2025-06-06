import { CrowdsplitPaymentMethodDetails } from './api/types';

export interface CrowdsplitCreateCustomerInterface {
  firstName: string;
  lastName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  dob: string;
  streetNumber: string;
  streetName: string;
  neighborhood?: string;
  city: string;
  state: string;
  addressCountryId: number;
  postalCode: string;
  phoneCountryCode: string;
  phoneAreaCode: string;
  phoneNumber: string;
}
export interface CrowdsplitCreateCustomerRequest {
  first_name: string;
  last_name: string;
  email: string;
  document_type: string;
  document_number: string;
  dob: string;
  street_number: string;
  street_name: string;
  neighborhood?: string;
  city: string;
  state: string;
  address_country_id: number;
  postal_code: string;
  phone_country_code: string;
  phone_area_code: string;
  phone_number: string;
}
export interface CrowdsplitCreateCustomerResponse {
  execStatus: boolean;
  httpStatus: number;
  msg: string;
  data: {
    id: string;
    email: string;
    // ... other customer fields exist but we only need id and email for now
  };
}
export interface CrowdsplitCreateDonationCustomerInterface {
  email: string;
}
export interface CrowdsplitCreateDonationCustomerRequest {
  email: string;
}
export interface CrowdsplitCreateDonationCustomerResponse {
  execStatus: boolean;
  httpStatus: number;
  msg: string;
  data: {
    id: string;
    email: string;
    // ... other fields exist but we only need id and email for now
  };
}
export interface CrowdsplitInitiateKycResponse {
  redirect_url?: string;
  redirectUrl?: string;
}
export interface CrowdsplitKycStatusResponse {
  status?: 'completed' | 'pending' | 'failed';
}
export interface CrowdsplitPaymentMethodGetInterface {
  customerId: string;
  id: string;
}
export interface CrowdsplitPaymentMethodGetResponse {
  id: string;
  type: string;
  bank_details: {
    bank_name: string;
    account_number: string;
    routing_number: string;
    account_type: string;
    account_name: string;
  };
}
// service api interface
export interface CrowdsplitPaymentMethodCreateInterface {
  customerId: string;
  type: string;
  bankDetails: CrowdsplitPaymentMethodDetails;
}
export interface CrowdsplitPaymentMethodCreateResponseInterface {
  id: string;
  type: string;
  bankDetails: CrowdsplitPaymentMethodDetails;
}
export interface CrowdsplitPaymentMethodCreateResponse {
  id: string;
  type: string;
  bank_details: {
    bank_name: string;
    account_number: string;
    routing_number: string;
    account_type: string;
    account_name: string;
  };
}
export interface CrowdsplitTransactionBuyInterface {
  customerId: string;
  fiatCurrency: string;
  cryptoCurrency: string;
  fiatAmount: number;
  paymentMethodId: string;
  walletAddress: string;
}
export interface CrowdsplitTransactionSellInterface {
  customerId: string;
  fiatCurrency: string;
  cryptoCurrency: string;
  cryptoAmount: number;
  walletAddress: string;
  [key: string]: unknown;
}
export interface CrowdsplitTransactionResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface CrowdsplitAssociateWalletInterface {
  walletAddress: string;
  walletType: string;
  customerId: string;
}
export interface CrowdsplitCreatePaymentInterface {
  amount: number;
  currency: string;
  customerId: string;
  paymentMethod: string;
  provider: string;
}
export interface CrowdsplitCreatePaymentPostRequest {
  amount: number;
  currency: string;
  customer_id: string;
  payment_method: string;
  provider: string;
}
export interface CrowdsplitCreatePaymentResponse {
  id: string;
}
export interface CrowdsplitCreatePaymentPostResponse {
  data: CrowdsplitCreatePaymentResponse;
}
export interface CrowdsplitConfirmPaymentInterface {
  id: string;
}
export interface CrowdsplitConfirmPaymentResponse {
  clientSecret: string;
  publicKey: string;
}
export interface CrowdsplitConfirmPaymentPostResponse {
  data: { metadata: { client_secret: string; public_key: string } };
}

// undocumented api
export interface CrowdsplitAssociateWalletResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface CrowdsplitCustomerData {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface CrowdsplitGetCustomerApiResponse {
  execStatus: boolean;
  httpStatus: number;
  msg: string;
  data: CrowdsplitCustomerData;
}
