import { http, createConfig } from 'wagmi'
import { sepolia, celoAlfajores, celo, mainnet } from 'wagmi/chains'
import { chainConfig } from '@/config/chain'
import type { Config } from 'wagmi'

// Export chains for use in other files
export { sepolia, celoAlfajores, celo, mainnet }

// Add type declaration for wagmi config
declare module 'wagmi' {
    interface Register {
        config: Config
    }
}

// Check for necessary environment variables
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID

if (!privyAppId) {
    console.warn("Wagmi Config Warning: NEXT_PUBLIC_PRIVY_APP_ID is not set. Privy connector might not function correctly.");
}

export const config = createConfig({
  chains: [celoAlfajores, sepolia, celo, mainnet],
  transports: {
    [celoAlfajores.id]: http(chainConfig.rpcUrl),
    [sepolia.id]: http(),
    [celo.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
}) as Config

// Log configuration details in development
if (process.env.NODE_ENV !== 'production') {
  console.log("Wagmi Config Created:", {
    chains: config.chains.map(c => `${c.name} (${c.id})`),
    privyAppIdUsed: privyAppId || "NOT SET",
  });
}
