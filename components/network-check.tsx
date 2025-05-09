'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useNetworkCheck } from '@/hooks/use-network';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface NetworkCheckProps {
  children: ReactNode;
}

export function NetworkCheck({ children }: NetworkCheckProps) {
  const { isCorrectNetwork, switchToAlfajores } = useNetworkCheck();
  const { toast } = useToast();
  const wasWrongNetwork = useRef(false);

  const handleNetworkSwitch = async () => {
    try {
      await switchToAlfajores();
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: 'Network Switch Failed',
        description: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm font-medium">
              Unable to switch network automatically. Please switch to Celo
              Alfajores manually in your wallet.
            </p>
          </div>
        ),
        variant: 'destructive',
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (!isCorrectNetwork) {
      wasWrongNetwork.current = true;
      toast({
        title: 'Network Error',
        description: (
          <div className="mt-2">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">
                Please switch to Celo Alfajores Testnet to use this app
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleNetworkSwitch}
              className="w-full text-black"
            >
              Switch Network
            </Button>
          </div>
        ),
        variant: 'destructive',
        duration: Infinity,
      });
    } else if (wasWrongNetwork.current) {
      // Only show success toast if we were previously on wrong network
      wasWrongNetwork.current = false;
      toast({
        title: 'Network Connected',
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-sm font-medium">
              Successfully connected to Celo Alfajores Testnet
            </p>
          </div>
        ),
        variant: 'default',
        duration: 3000,
      });
    }
  }, [isCorrectNetwork, switchToAlfajores, toast]);

  return <>{children}</>;
}
