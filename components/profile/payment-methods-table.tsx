import { useCallback, useState } from 'react';
import { PaymentMethod } from '@/types/payment';
import { CreditCard, Landmark, Loader2, Trash2 } from 'lucide-react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
export function ProfilePaymentMethodsTable({
  paymentMethods,
  onAdd,
  onDelete,
}: {
  paymentMethods: PaymentMethod[];
  onAdd: () => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const [deleting, setDeleting] = useState<number[]>([]);
  const onDeleteClicked = useCallback(
    async (id: number) => {
      setDeleting((prevState) => {
        if (prevState.includes(id)) {
          return prevState;
        }
        return prevState.concat(id);
      });
      try {
        await onDelete(id);
      } catch {}
      setDeleting((prevState) => {
        return prevState.filter((stateId) => stateId !== id);
      });
    },
    [onDelete, setDeleting],
  );
  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Landmark className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">No payment methods added</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Add a bank account to make donations via direct bank transfer.
        </p>
        <Button onClick={onAdd}>Add Bank Account</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMethods.map((method: PaymentMethod) => {
            // Safe casting of details to expected type
            const details = method.details;
            const isDeleting = deleting.includes(method.id);
            return (
              <TableRow key={method.id}>
                <TableCell>
                  <div className="flex items-center">
                    {method.type === 'BANK' ? (
                      <Landmark className="mr-2 h-4 w-4" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    {method.type === 'BANK' ? 'Bank Account' : 'Card'}
                  </div>
                </TableCell>
                <TableCell>
                  {method.type === 'BANK' && details && (
                    <div className="text-sm">
                      <p>{details.bankName}</p>
                      <p className="text-muted-foreground">
                        {details.accountType.charAt(0) +
                          details.accountType.slice(1).toLowerCase()}{' '}
                        ••••
                        {details.accountNumber.slice(-4)}
                      </p>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteClicked(method.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Button variant="outline" className="w-full" onClick={onAdd}>
        Add Another Payment Method
      </Button>
    </div>
  );
}
