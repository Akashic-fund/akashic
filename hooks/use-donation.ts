import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/lib/web3/hooks/use-web3';
import { switchNetwork } from '@/lib/web3/switch-network';
import { requestTransaction } from '@/lib/web3/request-transaction';
import {
  useCreatePayment,
  useUpdatePaymentStatus,
} from '@/lib/hooks/usePayments';
import { Campaign } from '@/types/campaign';
const debug = process.env.NODE_ENV !== 'production';

export function useDonationCallback({
  campaign,
  amount,
  selectedToken,
}: {
  campaign: Campaign;
  amount: string;
  selectedToken: string;
}) {
  const wallet = useWallet();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createPayment } = useCreatePayment();
  const { mutateAsync: updatePaymentStatus } = useUpdatePaymentStatus();

  const onDonate = useCallback(async () => {
    try {
      setIsProcessing(true);
      setError(null);
      debug && console.log('Starting donation process...');
      if (!wallet) {
        throw new Error('Wallet not connected');
      }

      debug && console.log('Getting wallet provider and signer...');
      const walletProvider = await wallet.getEthereumProvider();
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const userAddress = await signer.getAddress();
      if (!userAddress || !ethers.utils.isAddress(userAddress)) {
        throw new Error('User address is missing or invalid');
      }
      if (!campaign.treasuryAddress) {
        throw new Error('Campaign treasuryAddress is missing or invalid');
      }
      debug && console.log('User address:', userAddress);

      // Switch to Alfajores network first
      await switchNetwork({ wallet });
      const tx = await requestTransaction({
        address: campaign.treasuryAddress,
        amount,
        wallet,
      });

      // Only create payment record after transaction is sent
      debug && console.log('Creating payment record...');
      const { id: paymentId } = await createPayment({
        amount: amount,
        token: selectedToken,
        campaignId: campaign.id,
        isAnonymous: false,
        status: 'confirming',
        transactionHash: tx.hash,
      });

      debug && console.log('Payment record created with ID:', paymentId);

      debug && console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      debug && console.log('Transaction confirmed:', receipt);

      // Update payment status based on receipt
      debug && console.log('Updating payment status...');
      await updatePaymentStatus({
        paymentId,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
      });

      debug && console.log('Payment status updated');

      toast({
        title: 'Success!',
        description: 'Your donation has been processed',
      });
    } catch (err) {
      debug && console.error('Donation error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err && 'message' in err
            ? String(err.message)
            : 'Failed to process donation';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setError(
        err instanceof Error ? err.message : 'Failed to process wallet payment',
      );
    } finally {
      setIsProcessing(false);
    }
  }, [
    wallet,
    toast,
    createPayment,
    updatePaymentStatus,
    amount,
    campaign.id,
    campaign.treasuryAddress,
    selectedToken,
  ]);
  return { onDonate, isProcessing, error };
}
