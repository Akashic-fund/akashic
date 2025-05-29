import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { useCrowdsplitCreatePaymentMethod } from '@/lib/crowdsplit/hooks/useCrowdsplit';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts';
import { useCallback, useState, useEffect } from 'react';
import { z } from 'zod';
import { enableFormDefault } from '@/lib/develop';

const bankAccountSchema = z.object({
  type: z.literal('BANK'),
  provider: z.literal('CROWDSPLIT'),
  bankDetails: z.object({
    provider: z.literal('CROWDSPLIT'),
    bankName: z.string().min(2, 'Bank name is required'),
    accountNumber: z.string().min(4, 'Account number is required'),
    routingNumber: z
      .string()
      .min(9, 'Routing number must be 9 digits')
      .max(9, 'Routing number must be 9 digits'),
    accountType: z.enum(['CHECKING', 'SAVINGS']),
    accountName: z.string().min(2, 'Account name is required'),
  }),
});
const defaultValues: BankAccountFormValues = {
  type: 'BANK',
  provider: 'CROWDSPLIT',
  bankDetails: {
    provider: 'CROWDSPLIT',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'CHECKING',
    accountName: '',
  },
};

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

export function ProfileAddPaymentMethodDialog({
  onSuccess,
  onClosed,
  open,
}: {
  open?: boolean;
  onSuccess?: () => void;
  onClosed?: () => void;
}) {
  const [openIntern, setOpenIntern] = useState(open);
  const { toast } = useToast();
  const { address } = useAuth();
  const {
    mutateAsync: createPaymentMethod,
    isPending: isPendingCreatePaymentMethod,
  } = useCrowdsplitCreatePaymentMethod({ userAddress: address ?? '' });
  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues,
  });

  const onClose = useCallback(() => {
    if (typeof onClosed === 'function') {
      onClosed();
    }
    form.reset();
  }, [onClosed, form]);
  const onOpenChange = useCallback(
    (open: boolean) => {
      setOpenIntern(open);
      if (!open) {
        onClose();
      }
    },
    [setOpenIntern, onClose],
  );
  const onCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const onSubmit = useCallback(
    async (data: BankAccountFormValues) => {
      if (!address) {
        toast({
          title: 'Error',
          description: 'Please connect your wallet first',
          variant: 'destructive',
        });
        return;
      }

      try {
        console.log('Submitting payment method:', {
          type: data.type,
          bankDetails: {
            ...data.bankDetails,
            accountNumber: '****' + data.bankDetails.accountNumber.slice(-4),
          },
        });
        await createPaymentMethod(data);

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        onOpenChange(false);

        toast({
          title: 'Success',
          description: 'Payment method added successfully',
        });
      } catch (error) {
        console.error('Error adding payment method:', error);
        toast({
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to add payment method',
          variant: 'destructive',
        });
      }
    },
    [onSuccess, createPaymentMethod, toast, onOpenChange, address],
  );
  useEffect(() => {
    if (typeof open === 'boolean') {
      setOpenIntern(open);
    }
  }, [open]);
  const onDeveloperSubmit = useCallback(async () => {
    if (!enableFormDefault) {
      return;
    }
    await onSubmit({
      type: 'BANK',
      provider: 'CROWDSPLIT',
      bankDetails: {
        provider: 'CROWDSPLIT',
        bankName: 'MOCK-BANK-NAME',
        accountNumber: 'MOCK-ACCOUNT-NUMBER',
        routingNumber: 'MOCK-ROUTING-NUMBER',
        accountType: 'CHECKING',
        accountName: 'MOCK-ACCOUNT-NAME',
      },
    });
  }, [onSubmit]);
  return (
    <Dialog open={openIntern} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Payment Method</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>
            Add your bank account details to enable bank transfers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bankDetails.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Chase, Bank of America, etc."
                      {...field}
                      onDoubleClick={onDeveloperSubmit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankDetails.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bankDetails.accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678901" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bankDetails.routingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Routing Number</FormLabel>
                    <FormControl>
                      <Input placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bankDetails.accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHECKING">Checking</SelectItem>
                      <SelectItem value="SAVINGS">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPendingCreatePaymentMethod}>
                {isPendingCreatePaymentMethod ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Bank Account'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
