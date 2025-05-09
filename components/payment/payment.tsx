import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { PaymentLink } from '@/components/payment/link';
import { type Payment as PaymentType } from '@/types/campaign';
export function Payment({ payment }: { payment: PaymentType }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
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
        <PaymentLink payment={payment} />
      </div>
    </div>
  );
}
