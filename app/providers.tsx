'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';
import { WagmiProvider } from '@privy-io/wagmi';
import { celoAlfajores, sepolia, mainnet } from '@/config/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CollectionProvider } from '@/contexts/CollectionContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { EnvironmentProvider } from '@/components/environment-theme-provider';
import { createConfig } from '@privy-io/wagmi';
import { http } from 'wagmi';
import { chainConfig } from '@/config/chain';
import { AccountProvider, AuthProvider } from "@/contexts";

// Create Privy-specific wagmi config
const privyWagmiConfig = createConfig({
  chains: [celoAlfajores, sepolia, mainnet],
  transports: {
    [celoAlfajores.id]: http(chainConfig.rpcUrl),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          accentColor: '#44d29b',
          theme: '#FFFFFF',
          showWalletLoginFirst: false,
          logo: 'https://auth.privy.io/logos/privy-logo.png',
          walletChainType: 'ethereum-only',
        },
        loginMethods: ['email', 'wallet', 'google', 'github'],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        defaultChain: chainConfig.defaultChain,
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={privyWagmiConfig}>
          <SidebarProvider>
            <CollectionProvider>
              <EnvironmentProvider>
                <AccountProvider>
                  <AuthProvider>{children}</AuthProvider>
                </AccountProvider>
              </EnvironmentProvider>
            </CollectionProvider>
          </SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
