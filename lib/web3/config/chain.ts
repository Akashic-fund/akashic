/**
 * Global chain configuration for the application.
 * This centralizes all chain-related constants used across components.
 */

import { celoAlfajores } from 'wagmi/chains';

export const chainConfig = {
  // Chain identifiers
  chainId: {
    hex: `0x${celoAlfajores.id.toString(16)}`,
    decimal: celoAlfajores.id,
  },

  // Chain details derived from wagmi
  name: celoAlfajores.name,
  nativeCurrency: celoAlfajores.nativeCurrency,

  // Custom values not from wagmi
  rpcUrl:
    process.env.NEXT_PUBLIC_RPC_URL || celoAlfajores.rpcUrls.default.http[0],
  blockExplorerUrl:
    celoAlfajores.blockExplorers?.default?.url ||
    'https://alfajores.celoscan.io/',

  // Reference to the actual chain object for provider configurations
  defaultChain: celoAlfajores,

  // Helper methods
  getAddChainParams() {
    return {
      chainId: this.chainId.hex,
      chainName: this.name,
      nativeCurrency: this.nativeCurrency,
      rpcUrls: [this.rpcUrl],
      blockExplorerUrls: [this.blockExplorerUrl],
    };
  },
};

export default chainConfig;
