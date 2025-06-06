import { LinkIcon } from 'lucide-react';
import { type Payment } from '@/types/campaign';

export function PaymentLink({ payment }: { payment: Payment }) {
  // Only show blockchain links for crypto payments that have transaction hashes
  if (!payment.transactionHash) {
    return null;
  }

  // Check if this is a crypto payment based on metadata or presence of transaction hash
  const metadata = payment.metadata as any;
  const paymentMethod =
    metadata?.paymentMethod ||
    (payment.transactionHash ? 'crypto' : 'credit_card');

  // Don't show blockchain link for credit card payments
  if (paymentMethod === 'credit_card') {
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
      View on Explorer
    </a>
  );
}
