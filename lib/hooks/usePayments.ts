import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Payment } from '@/types/campaign';

const PAYMENT_QUERY_KEY = 'payment';

interface ICreatePaymentApi {
  amount: string;
  token: string;
  campaignId: number;
  status: string;
  transactionHash: string;
  isAnonymous: boolean;
}
async function createPayment(variables: ICreatePaymentApi): Promise<Payment> {
  const response = await fetch(`/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to create payment record:', error);
    throw new Error(error.error || 'Failed to fetch user payments');
  }
  const data = await response.json();
  return data;
}
interface IUpdatePaymentStatusApi {
  paymentId: number;
  status: string;
}
async function updatePaymentStatus(variables: IUpdatePaymentStatusApi) {
  const response = await fetch(`/api/payments`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(variables),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to update payment record:', error);
    throw new Error(error.error || 'Failed to update user payment');
  }
  return response.json();
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENT_QUERY_KEY],
      });
    },
  });
}
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PAYMENT_QUERY_KEY],
      });
    },
  });
}
