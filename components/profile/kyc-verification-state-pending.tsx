import { Alert, AlertTitle, AlertDescription, Button } from '@/components/ui';
import { AlertCircle, ExternalLink } from 'lucide-react';

export function ProfileKYCVerificationStatePending({
  kycUrl,
}: {
  kycUrl?: string;
}) {
  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertCircle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-600">
        KYC Verification In Progress
      </AlertTitle>
      <AlertDescription className="text-yellow-600">
        {kycUrl ? (
          <>
            <p className="mb-4">
              Please complete your KYC verification process by clicking the
              button below.
            </p>
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => window.open(kycUrl, '_blank')}
            >
              Complete KYC Verification{' '}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          'Your KYC verification is being processed. This may take some time.'
        )}
      </AlertDescription>
    </Alert>
  );
}
