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

  // Determine payment method from metadata or transaction hash
  const paymentMethod = useMemo(() => {
    const metadata = payment.metadata as any;
    if (metadata?.paymentMethod) {
      return metadata.paymentMethod;
    }
    // Fallback: if has transaction hash, it's crypto, otherwise credit card
    return payment.transactionHash ? 'crypto' : 'credit_card';
  }, [payment.metadata, payment.transactionHash]);

  const originalToken = useMemo(() => {
    const metadata = payment.metadata as any;
    return metadata?.originalToken || 'USD';
  }, [payment.metadata]);

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
        <p className="font-medium">${payment.amount} USD</p>
        <p className="text-xs text-gray-500">
          {paymentMethod === 'crypto' ? `via ${originalToken}` : 'Credit Card'}
        </p>
        <PaymentLink payment={payment} />
      </div>
    </div>
  );
}
