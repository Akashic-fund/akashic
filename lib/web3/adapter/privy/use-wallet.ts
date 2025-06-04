import { useWallets as usePrivyWallets } from '@privy-io/react-auth';
import { ConnectedWallet } from '@/lib/web3/types';

export function useWallet(): ConnectedWallet | null {
  const { wallets: privyWallets } = usePrivyWallets();
  if (!privyWallets.length) {
    return null;
  }
  const wallet = privyWallets[0]; // Assuming first wallet
  return wallet;
}
