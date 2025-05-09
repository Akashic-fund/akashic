import { Alert, AlertTitle, AlertDescription } from '@/components/ui';
import { AlertCircle } from 'lucide-react';
export function CampaignError({
  error,
}: {
  error: Error | string | undefined;
}) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : 'An error occurred';
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
}
