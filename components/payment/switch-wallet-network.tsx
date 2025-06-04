import { Button } from '@/components/ui';
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNetworkCheck } from '@/hooks/use-network';
import { AlertCircle } from 'lucide-react';
import chainConfig from '@/lib/web3/config/chain';
export function PaymentSwitchWalletNetwork() {
  const { toast } = useToast();
  const { isCorrectNetwork, switchToAlfajores } = useNetworkCheck();

  const handleNetworkSwitch = useCallback(async () => {
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
              Unable to switch network automatically. Please switch to{' '}
              {chainConfig.name} manually in your wallet.
            </p>
          </div>
        ),
        variant: 'destructive',
        duration: 5000,
      });
    }
  }, [switchToAlfajores, toast]);
  if (isCorrectNetwork) {
    return null;
  }
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleNetworkSwitch}
      className="w-full text-black"
    >
      Switch Network
    </Button>
  );
}
