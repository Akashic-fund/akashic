import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CrowdsplitCustomerGetResponse,
  CrowdsplitCustomerPostRequest,
  CrowdsplitCustomerPostResponse,
  CrowdsplitKycInitiatePostRequest,
  CrowdsplitKycInitiatePostResponse,
  CrowdsplitKycStatusGetResponse,
  CrowdsplitPaymentMethodDeleteRequest,
  CrowdsplitPaymentMethodDeleteResponse,
  CrowdsplitPaymentMethodsGetResponse,
  CrowdsplitPaymentMethodsPostRequest,
  CrowdsplitPaymentMethodsPostResponse,
  CrowdsplitWalletAddressesPostRequest,
  CrowdsplitWalletAddressesPostResponse,
} from '../api/types';
import { useAuth } from '@/contexts';
const CROWDSPLIT_QUERY_KEY = 'crowdsplit';

async function fetchKYCStatus() {
  const response = await fetch(`/api/crowdsplit/kyc/status`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch kyc status');
  }
  const data: CrowdsplitKycStatusGetResponse = await response.json();
  return data;
}
async function fetchPaymentMethods() {
  const response = await fetch(`/api/crowdsplit/payment-methods`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch payment methods');
  }
  const data: CrowdsplitPaymentMethodsGetResponse = await response.json();
  return data.paymentMethods;
}
async function fetchCustomer() {
  const response = await fetch(`/api/crowdsplit/customer`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch customer');
  }
  const data: CrowdsplitCustomerGetResponse = await response.json();
  return data;
}
async function initiateKYC(variables: CrowdsplitKycInitiatePostRequest) {
  const response = await fetch(`/api/crowdsplit/kyc/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to initiate kyc');
  }
  const data: CrowdsplitKycInitiatePostResponse = await response.json();
  return data;
}
async function updateCustomer(variables: CrowdsplitCustomerPostRequest) {
  const response = await fetch(`/api/crowdsplit/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to initiate kyc');
  }
  const data: CrowdsplitCustomerPostResponse = await response.json();
  return data;
}
async function createPaymentMethod(
  variables: CrowdsplitPaymentMethodsPostRequest,
) {
  const response = await fetch(`/api/crowdsplit/payment-methods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to initiate kyc');
  }
  const data: CrowdsplitPaymentMethodsPostResponse = await response.json();
  return data;
}
async function deletePaymentMethod(
  variables: CrowdsplitPaymentMethodDeleteRequest,
) {
  const response = await fetch(
    `/api/crowdsplit/payment-methods/${variables.paymentMethodId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(variables),
    },
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete payment method');
  }
  const data: CrowdsplitPaymentMethodDeleteResponse = await response.json();
  return data;
}
async function updateWalletAddress(
  variables: CrowdsplitWalletAddressesPostRequest,
) {
  const response = await fetch('/api/crowdsplit/wallet-addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update wallet address');
  }
  const data: CrowdsplitWalletAddressesPostResponse = await response.json();
  return data;
}

//
// read hooks
//

export function useCrowdsplitKYCStatus() {
  const { authenticated } = useAuth();
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'kyc-status'],
    queryFn: fetchKYCStatus,
    refetchInterval: 30_000,
    enabled: authenticated,
  });
}
export function useCrowdsplitPaymentMethods() {
  const { authenticated } = useAuth();
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
    queryFn: fetchPaymentMethods,
    enabled: authenticated,
  });
}
export function useCrowdsplitCustomer() {
  const { authenticated } = useAuth();
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'customer'],
    queryFn: fetchCustomer,
    enabled: authenticated,
  });
}

//
// mutation hooks
//

export function useCrowdsplitKYCInitiate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initiateKYC,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'kyc-status'],
      });
    },
  });
}
export function useCrowdsplitUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'customer'],
      });
    },
  });
}
export function useCrowdsplitCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
      });
    },
  });
}
export function useCrowdsplitDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentMethod,
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
      });
    },
  });
}
export function useCrowdsplitUpdateWalletAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWalletAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
}
