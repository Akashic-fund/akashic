import { useMemo } from 'react';
import { type Payment } from '@/types/campaign';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui';
import { PaymentLink } from './link';
export function PaymentItem({ payment }: { payment: Payment }) {
  const userName = useMemo(() => {
    if (!payment.user || payment.isAnonymous) {
      return 'Anonymous Donor';
    }
    if (
      typeof payment.user.firstName === 'string' &&
      typeof payment.user.lastName === 'string'
    ) {
      return `${payment.user.firstName} ${payment.user.lastName}`;
    }
    if (typeof payment.user.username === 'string') {
      return payment.user.username;
    }
    if (typeof payment.user.address !== 'string') {
      return 'Anonymous Donor';
    }
    return `${payment.user.address.slice(0, 6)}...${payment.user.address.slice(-4)}`;
  }, [payment.user, payment.isAnonymous]);
  const userAvatar = useMemo(() => {
    if (!payment?.user?.address) {
      return null;
    }
    return `https://avatar.vercel.sh/${payment.user.address}`;
  }, [payment?.user?.address]);
  return (
    <div
      key={payment.id}
      className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
    >
      <div className="flex items-center gap-4">
        <Avatar>
          {userAvatar ? <AvatarImage src={userAvatar} /> : null}
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-gray-500">
            {new Date(payment.createdAt ?? 0).toLocaleDateString()}
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
