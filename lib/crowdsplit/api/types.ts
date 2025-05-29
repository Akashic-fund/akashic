/**
 * Types for /api/crowdsplit
 */
export interface CrowdsplitCustomerPostResponse {
  success: boolean;
  customerId: string;
}
export interface CrowdsplitCustomerPostRequest {
  userAddress: string;

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
export interface CrowdsplitCustomerGetRequest {
  userAddress: string;
}
export interface CrowdsplitCustomerGetResponse {
  hasCustomer: boolean;
  customerId?: string;
  isKycCompleted?: boolean;
  message?: string;
}
// /api/crowdsplit/donation-customer
export interface CrowdsplitDonationCustomerPostResponse {
  success: boolean;
  customerId: string;
}
export interface CrowdsplitDonationCustomerPostRequest {
  email: string;
}
// /api/crowdsplit/kyc/complete
export interface CrowdsplitKycCompletePostRequest {
  userAddress: string;
}
export interface CrowdsplitKycCompletePostResponse {
  success: boolean;
  message: string;
}
// /api/crowdsplit/kyc/initiate
export interface CrowdsplitKycInitiatePostRequest {
  userAddress: string;
}
export interface CrowdsplitKycInitiatePostResponse {
  success: boolean;
  redirectUrl: string;
}
// /api/crowdsplit/kyc/status
export interface CrowdsplitKycStatusGetRequest {
  userAddress: string;
}
export interface CrowdsplitKycStatusGetResponse {
  status: 'pending' | 'completed' | 'failed';
  customerId: string;
  crowdsplitError?: string;
}
// /api/crowdsplit/payment-methods/[paymentMethodId]
export interface CrowdsplitPaymentMethodGetRequest {
  paymentMethodId: string; // path
  userAddress: string;
}
// duplicate of types/payment/PaymentMethodBankDetails
export interface CrowdsplitPaymentMethodDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'CHECKING' | 'SAVINGS';
  accountName: string;
  provider: 'CROWDSPLIT';
}
// duplicate of types/payment/PaymentMethod
export interface CrowdsplitPaymentMethodGetResponse {
  id: number;
  provider: string;
  externalId: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  details?: CrowdsplitPaymentMethodDetails;
}
// /api/crowdsplit/payment-methods
export interface CrowdsplitPaymentMethodsGetRequest {
  userAddress: string;
}
export interface CrowdsplitPaymentMethodsGetResponse {
  paymentMethods: CrowdsplitPaymentMethodGetResponse[];
}

export interface CrowdsplitPaymentMethodsPostRequest {
  userAddress: string;
  type: string;
  provider: string;
  bankDetails: CrowdsplitPaymentMethodDetails;
}
export interface CrowdsplitPaymentMethodsPostResponse {
  success: boolean;
  paymentMethod: CrowdsplitPaymentMethodGetResponse;
}
export interface CrowdsplitPaymentMethodDeleteRequest {
  userAddress: string;
  paymentMethodId: number;
}
export interface CrowdsplitPaymentMethodDeleteResponse {
  success: boolean;
}
// /api/crowdsplit/payments/[id]/confirm
export interface CrowdsplitConfirmPaymentPostRequest {}
export interface CrowdsplitConfirmPaymentPostResponse {
  success: boolean;
  clientSecret: string;
  publicKey: string;
}
// /api/crowdsplit/payments
export interface CrowdsplitCreatePaymentPostRequest {
  amount: number;
  customerId: string;
  currency: string;
  paymentMethod: string;
  provider: string;
}
export interface CrowdsplitCreatePaymentPostResponse {
  success: boolean;
  id: string;
}

// /api/crowdsplit/transactions
export interface CrowdsplitTransactionsPostRequest {
  userAddress: string;
  campaignId: number;
  type: 'SELL' | 'BUY';
  customerId: string;
  currency: string;
  amount: number;
  paymentMethodId: string;
}
// /api/crowdsplit/wallet-addresses
export interface CrowdsplitWalletAddressesPostRequest {
  userAddress: string;
  walletAddress?: string;
}
export interface CrowdsplitWalletAddressesPostResponse {
  success: boolean;
  message: string;
}

// /api/crowdsplit/webhook/kyc
export interface CrowdsplitWebhookKycPostRequest {
  'crowdsplit-signature': string;
  event: string;
  data: {
    customer_id: string;
    status: string;
  };
}
export interface CrowdsplitWebhookKycPostResponse {
  success: boolean;
}
