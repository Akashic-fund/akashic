'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isServerError = error?.digest || error.message?.includes('server');
  const errorTitle = isServerError
    ? '500 - Server Error'
    : 'Something went wrong!';
  const errorMessage = isServerError
    ? 'Sorry, something went wrong on our server.'
    : error.message || 'An unexpected error occurred';

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mx-auto max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">{errorTitle}</h1>
        <p className="mb-8 text-muted-foreground">{errorMessage}</p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
