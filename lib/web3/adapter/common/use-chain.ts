import { useMemo } from 'react';
import { useAccount as useWagmiAccount } from 'wagmi';
import { type Address } from 'viem';
import { IWeb3UseChainHook } from '@/lib/web3/types';

export function useChain(): IWeb3UseChainHook {
  const {
    address: wagmiAddress,
    chain,
    chainId,
    // unused:
    isConnected,
    isConnecting,
    isReconnecting,
    status,
  } = useWagmiAccount();
  const address: Address | undefined = useMemo(() => {
    if (
      typeof wagmiAddress !== 'string' ||
      !wagmiAddress.toLowerCase().startsWith('0x')
    ) {
      return undefined;
    }
    return wagmiAddress.toLowerCase() as Address;
  }, [wagmiAddress]);
  const value = useMemo(
    () => ({
      address,
      chain,
      chainId,
      // not used:
      isConnected,
      isConnecting,
      isReconnecting,
      status,
    }),
    [
      address,
      chain,
      chainId,
      // unused
      isConnected,
      isConnecting,
      isReconnecting,
      status,
    ],
  );
  return value;
}
