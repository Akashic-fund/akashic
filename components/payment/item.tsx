import { type Payment } from '@/types/campaign';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { Link as LinkIcon } from 'lucide-react';
export function PaymentItem({ payment }: { payment: Payment }) {
  return (
    <div
      key={payment.id}
      className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
    >
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={`https://avatar.vercel.sh/${payment.user.address}`}
          />
          <AvatarFallback>
            {payment.isAnonymous
              ? 'A'
              : payment.user.address.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {payment.isAnonymous
              ? 'Anonymous Donor'
              : `${payment.user.address.slice(0, 6)}...${payment.user.address.slice(-4)}`}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(payment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">
          {payment.amount} {payment.token}
        </p>
        {payment.transactionHash && (
          <a
            href={`https://alfajores.celoscan.io/tx/${payment.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
          >
            <LinkIcon className="h-3 w-3" />
            View Transaction
          </a>
        )}
      </div>
    </div>
  );
}
