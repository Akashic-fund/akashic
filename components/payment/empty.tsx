import { Button } from '@/components/ui';

export function PaymentEmpty() {
  return (
    <div className="py-8 text-center">
      <p className="mb-4 text-gray-500">
        No donations yet. Be the first to support this campaign!
      </p>
      <Button>Make a Donation</Button>
    </div>
  );
}
