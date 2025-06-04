import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ConnectedWallet } from '@/lib/web3/types';
import { EthereumProvider } from '@silk-wallet/silk-wallet-sdk';

export function useWallet(): ConnectedWallet | null {
  const { address: wagmiAddress, isConnected, connector } = useAccount();

  const { wallets: silkWallets } = useMemo(() => {
    const normalizedAddress =
      typeof wagmiAddress === 'string' ? wagmiAddress.toLowerCase() : undefined;
    return {
      wallets: [
        {
          getEthereumProvider: async (): Promise<EthereumProvider> => {
            return (await connector?.getProvider()) as EthereumProvider;
          },
          isConnected: async () => {
            return isConnected;
          },
          address: normalizedAddress,
        },
      ],
    };
  }, [isConnected, wagmiAddress, connector]);
  if (!silkWallets.length) {
    return null;
  }
  const wallet = silkWallets[0]; // Assuming first wallet
  return wallet;
}
