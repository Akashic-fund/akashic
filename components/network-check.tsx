'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useNetworkCheck } from '@/hooks/use-network';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { PaymentSwitchWalletNetwork } from './payment/switch-wallet-network';
import { useAuth } from '@/contexts';
import { chainConfig } from '@/lib/web3/config/chain';

interface NetworkCheckProps {
  children: ReactNode;
}

export function NetworkCheck({ children }: NetworkCheckProps) {
  const { isReady, authenticated } = useAuth();
  const { isCorrectNetwork, switchToAlfajores } = useNetworkCheck();
  const { toast } = useToast();
  const wasWrongNetwork = useRef(false);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (!authenticated) {
      return;
    }
    if (!isCorrectNetwork) {
      wasWrongNetwork.current = true;
      toast({
        title: 'Network Error',
        description: (
          <div className="mt-2">
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">
                Please switch to {chainConfig.name} to use this app
              </p>
            </div>
            <PaymentSwitchWalletNetwork />
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
              Successfully connected to {chainConfig.name}
            </p>
          </div>
        ),
        variant: 'default',
        duration: 3000,
      });
    }
  }, [authenticated, isReady, isCorrectNetwork, switchToAlfajores, toast]);

  return children;
}
