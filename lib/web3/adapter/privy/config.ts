import { createConfig } from '@privy-io/wagmi';
import { PRIVY_APP_ID } from '@/lib/constant';
import { celoAlfajores, sepolia, mainnet } from '@/lib/web3/config/wagmi';
import { chainConfig } from '@/lib/web3/config/chain';
import { http } from 'wagmi';
// Check for necessary environment variables

if (!PRIVY_APP_ID.length) {
  console.warn(
    'Wagmi Config Warning: NEXT_PUBLIC_PRIVY_APP_ID is not set.' +
      ' Privy connector might not function correctly.',
  );
}

// Create Privy-specific wagmi config
export const config = createConfig({
  chains: [celoAlfajores, sepolia, mainnet],
  transports: {
    [celoAlfajores.id]: http(chainConfig.rpcUrl),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
