'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';

import { useToast } from '@/hooks/use-toast';

import { PaymentMethod } from '@/types/payment';
import { useCrowdsplitDeletePaymentMethod } from '@/lib/crowdsplit/hooks/useCrowdsplit';
import { useAuth } from '@/contexts';
import { ProfileAddPaymentMethodDialog } from './add-payment-method-dialog';
import { ProfilePaymentMethodsTable } from './payment-methods-table';

interface PaymentMethodsFormProps {
  paymentMethods: PaymentMethod[];
  onSuccess?: () => void;
}

export function PaymentMethodsForm({
  paymentMethods,
  onSuccess,
}: PaymentMethodsFormProps) {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { address } = useAuth();

  const { mutateAsync: deletePaymentMethod } = useCrowdsplitDeletePaymentMethod(
    {
      userAddress: address ?? '',
    },
  );
  const onCreateNewPaymentMethod = useCallback(() => {
    setShowAddDialog(true);
  }, [setShowAddDialog]);
  const onDeletePaymentMethod = useCallback(
    async (paymentMethodId: number) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        });
        throw new Error('invalid wallet');
      }

      try {
        await deletePaymentMethod({ paymentMethodId });
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        toast({
          title: 'Success',
          description: 'Payment method deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting payment method:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to delete payment method',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [toast, deletePaymentMethod, address, onSuccess],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription>
            Add or manage your payment methods for donations.
          </CardDescription>
        </div>
        <ProfileAddPaymentMethodDialog open={showAddDialog} />
      </CardHeader>
      <CardContent>
        <ProfilePaymentMethodsTable
          paymentMethods={paymentMethods ?? []}
          onAdd={onCreateNewPaymentMethod}
          onDelete={onDeletePaymentMethod}
        />
      </CardContent>
    </Card>
  );
}
