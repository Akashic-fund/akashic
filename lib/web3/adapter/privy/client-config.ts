import type { PrivyClientConfig } from '@privy-io/react-auth';
import { chainConfig } from '@/lib/web3/config/chain';

export const providerClientConfig: PrivyClientConfig = {
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
};
