import { Alert, AlertTitle, AlertDescription, Button } from '@/components/ui';
import { AlertCircle, Loader2 } from 'lucide-react';

export function ProfileKYCVerificationStateFailed({
  onInitiateKYC,
  isPending,
}: {
  onInitiateKYC: () => Promise<void>;
  isPending: boolean;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>KYC Verification Failed</AlertTitle>
      <AlertDescription>
        Your identity verification failed. Please try again.
        <Button
          variant="outline"
          className="mt-4 border-destructive bg-white text-destructive"
          onClick={onInitiateKYC}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Retry KYC Verification'
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
