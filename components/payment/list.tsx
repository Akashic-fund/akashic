import { type Payment } from '@/types/campaign';
import { PaymentItem } from './item';
export function PaymentList({ payments }: { payments: Payment[] }) {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <PaymentItem key={payment.id} payment={payment} />
      ))}
    </div>
  );
}
