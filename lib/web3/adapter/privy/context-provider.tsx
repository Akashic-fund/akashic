import { type ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi';
import { providerClientConfig as privyProviderClientConfig } from '@/lib/web3/adapter/privy/client-config';
import { config as privyWagmiConfig } from '@/lib/web3/adapter/privy/config';

import { PRIVY_APP_ID } from '@/lib/constant';

export function Web3ContextProvider({ children }: { children: ReactNode }) {
  if (!PRIVY_APP_ID.length) {
    console.warn('[DEV]: missing PRIVY_APP_ID');
  }
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyProviderClientConfig}>
      <PrivyWagmiProvider config={privyWagmiConfig}>
        {children}
      </PrivyWagmiProvider>
    </PrivyProvider>
  );
}
