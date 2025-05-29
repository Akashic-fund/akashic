import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CrowdsplitCustomerGetRequest,
  CrowdsplitCustomerGetResponse,
  CrowdsplitCustomerPostRequest,
  CrowdsplitCustomerPostResponse,
  CrowdsplitKycInitiatePostRequest,
  CrowdsplitKycInitiatePostResponse,
  CrowdsplitKycStatusGetRequest,
  CrowdsplitKycStatusGetResponse,
  CrowdsplitPaymentMethodDeleteRequest,
  CrowdsplitPaymentMethodDeleteResponse,
  CrowdsplitPaymentMethodDetails,
  CrowdsplitPaymentMethodsGetRequest,
  CrowdsplitPaymentMethodsGetResponse,
  CrowdsplitPaymentMethodsPostRequest,
  CrowdsplitPaymentMethodsPostResponse,
  CrowdsplitWalletAddressesPostRequest,
  CrowdsplitWalletAddressesPostResponse,
} from '../api/types';

const CROWDSPLIT_QUERY_KEY = 'crowdsplit';

interface ICrowdsplitUpdateCustomerHook {
  userAddress: string;
}
interface ICrowdsplitUpdateCustomerRequestMutationApi {
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

interface ICrowdsplitCreatePaymentMethodHook {
  userAddress: string;
}
interface ICrowdsplitCreatePaymentMethodRequestMutationApi {
  type: string;
  provider: string;
  bankDetails: CrowdsplitPaymentMethodDetails;
}

interface ICrowdsplitDeletePaymentMethodHook {
  userAddress: string;
}
interface ICrowdsplitDeletePaymentMethodRequestMutationApi {
  paymentMethodId: number;
}
interface ICrowdsplitUpdateWalletAddressHook {
  userAddress: string;
}
interface ICrowdsplitUpdateWalletAddressMutationApi {
  walletAddress: string;
}

async function fetchKYCStatus(variables: CrowdsplitKycStatusGetRequest) {
  const response = await fetch(
    `/api/crowdsplit/kyc/status?userAddress=${variables.userAddress}`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch kyc status');
  }
  const data: CrowdsplitKycStatusGetResponse = await response.json();
  return data;
}
async function fetchPaymentMethods(
  variables: CrowdsplitPaymentMethodsGetRequest,
) {
  const response = await fetch(
    `/api/crowdsplit/payment-methods?userAddress=${variables.userAddress}`,
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch payment methods');
  }
  const data: CrowdsplitPaymentMethodsGetResponse = await response.json();
  return data.paymentMethods;
}
async function fetchCustomer(variables: CrowdsplitCustomerGetRequest) {
  const response = await fetch(
    `/api/crowdsplit/customer?userAddress=${variables.userAddress}`,
  );
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
    body: JSON.stringify({
      userAddress: variables.userAddress,
    }),
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
    `/api/crowdsplit/payment-methods/${variables.paymentMethodId}?userAddress=${variables.userAddress}`,
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

export function useCrowdsplitKYCStatus(
  variables: CrowdsplitKycStatusGetRequest,
) {
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'kyc-status'],
    queryFn: async () => fetchKYCStatus(variables),
    refetchInterval: 30_000,
  });
}
export function useCrowdsplitPaymentMethods(
  variables: CrowdsplitPaymentMethodsGetRequest,
) {
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
    queryFn: async () => {
      if (!variables.userAddress) {
        throw new Error('Failed to fetch Payment-Methods, address missing');
      }
      return fetchPaymentMethods(variables);
    },
    enabled: !!variables.userAddress,
  });
}
export function useCrowdsplitCustomer(variables: CrowdsplitCustomerGetRequest) {
  return useQuery({
    queryKey: [CROWDSPLIT_QUERY_KEY, 'customer'],
    queryFn: async () => {
      if (!variables.userAddress) {
        throw new Error('Failed to fetch Customer, address missing');
      }
      return fetchCustomer(variables);
    },
    enabled: !!variables.userAddress,
  });
}

//
// mutation hooks
//

export function useCrowdsplitKYCInitiate(
  variables: CrowdsplitKycInitiatePostRequest,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => initiateKYC(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'kyc-status'],
      });
    },
  });
}
export function useCrowdsplitUpdateCustomer({
  userAddress,
}: ICrowdsplitUpdateCustomerHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: ICrowdsplitUpdateCustomerRequestMutationApi,
    ) =>
      updateCustomer({
        ...variables,
        userAddress,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'customer'],
      });
    },
  });
}
export function useCrowdsplitCreatePaymentMethod({
  userAddress,
}: ICrowdsplitCreatePaymentMethodHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: ICrowdsplitCreatePaymentMethodRequestMutationApi,
    ) =>
      createPaymentMethod({
        ...variables,
        userAddress: userAddress ?? '',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CROWDSPLIT_QUERY_KEY, 'payment-methods'],
      });
    },
  });
}
export function useCrowdsplitDeletePaymentMethod({
  userAddress,
}: ICrowdsplitDeletePaymentMethodHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: ICrowdsplitDeletePaymentMethodRequestMutationApi,
    ) =>
      deletePaymentMethod({
        ...variables,
        userAddress: userAddress ?? '',
      }),
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
export function useCrowdsplitUpdateWalletAddress({
  userAddress,
}: ICrowdsplitUpdateWalletAddressHook) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: ICrowdsplitUpdateWalletAddressMutationApi) =>
      updateWalletAddress({
        ...variables,
        userAddress,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['profile'],
      });
    },
  });
}
