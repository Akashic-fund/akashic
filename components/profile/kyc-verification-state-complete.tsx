import { Alert, AlertTitle, AlertDescription, Button } from '@/components/ui';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function ProfileKYCVerificationStateComplete() {
  return (
    <Alert className="border-green-200 bg-green-50">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-600">
        KYC Verification Complete
      </AlertTitle>
      <AlertDescription className="text-green-600">
        <p>
          Your identity has been verified successfully. You can now add payment
          methods.
        </p>
        <Link href="/profile/payment-methods">
          <Button>Payment Methods</Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}
