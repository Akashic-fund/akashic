import { LinkIcon } from 'lucide-react';
import { type Payment } from '@/types/campaign';

export function PaymentLink({ payment }: { payment: Payment }) {
  if (!payment.transactionHash) {
    return null;
  }
  return (
    <a
      href={`https://alfajores.celoscan.io/tx/${payment.transactionHash}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
    >
      <LinkIcon className="h-3 w-3" />
      View Transaction
    </a>
  );
}
