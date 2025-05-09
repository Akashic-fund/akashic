import { Suspense } from 'react';
import { PaymentStatus } from '@/components/payment/status';
import { PaymentStatusLoading } from '@/components/payment/status-loading';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentStatusLoading />}>
      <PaymentStatus />
    </Suspense>
  );
}
