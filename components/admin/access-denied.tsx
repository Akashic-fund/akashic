import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { Card, CardContent, Button } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

export function AdminAccessDenied() {
  const { authenticated, login } = useAuth();
  const router = useRouter();
  const [hasAttemptedLogin, setHasAttemptedLogin] = useState(false);
  const onConnectWallet = useCallback(() => {
    if (!hasAttemptedLogin) {
      setHasAttemptedLogin(true);
      login();
    } else {
      // If already attempted, redirect instead of trying repeatedly
      router.push('/');
    }
  }, [hasAttemptedLogin, login, router]);
  const onGotoHomepage = useCallback(() => {
    router.push('/');
  }, [router]);
  return (
    <Card className="border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900">
          {!authenticated ? 'Connect Wallet' : 'Unauthorized Access'}
        </h3>
        <p className="mb-6 max-w-md text-gray-500">
          {!authenticated
            ? 'Please connect your wallet to access the admin dashboard.'
            : 'This page is restricted to admin users only.'}
        </p>
        {!authenticated && (
          <Button
            onClick={onConnectWallet}
            className="mb-2 bg-primary hover:bg-primary/90"
          >
            {hasAttemptedLogin ? 'Go to Home Page' : 'Connect Wallet'}
          </Button>
        )}
        {authenticated && (
          <Button
            onClick={onGotoHomepage}
            className="mb-2 bg-primary hover:bg-primary/90"
          >
            Go to Home Page
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
