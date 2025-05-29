import { Button } from '@/components/ui';
import { Loader2 } from 'lucide-react';

export function ProfileKYCVerificationStateDefault({
  isPending,
  onInitiateKYC,
}: {
  isPending: boolean;
  onInitiateKYC?: () => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        To verify your identity, you will need to complete a KYC (Know Your
        Customer) process. This helps us comply with regulations and ensure the
        security of transactions.
      </p>
      <p className="text-sm text-muted-foreground">
        You will need to provide identification documents such as a passport,
        driver&apos;s license, or national ID card.
      </p>
      {typeof onInitiateKYC === 'function' && (
        <Button onClick={onInitiateKYC} disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initiating KYC...
            </>
          ) : (
            'Start KYC Verification'
          )}
        </Button>
      )}
    </div>
  );
}
