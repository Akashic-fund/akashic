import {
  ConnectedWallet,
  IWeb3UseAuthHook,
  IWeb3UseChainHook,
  EthereumProvider,
} from '@/lib/web3/types';

/**
 * This is a very basic adapter
 * It may be used to access everything a anon web2-user can read
 * but will fail as soon as components are loaded that rely on viem/wagmi/ethers
 */

export { Web3ContextProvider } from './context-provider';
const staticAuth = {
  address: '0x0',
  authenticated: false,
  ready: true,
  login: async () => {
    alert('dummy context only, switch in /lib/web3/adapter');
  },
  logout: async () => {},
};
const staticWallet = {
  getEthereumProvider: async (): Promise<EthereumProvider> => {
    return {
      request: async () => {},
      on: (event: string, handler: (payload: unknown) => void) => {
        console.log('staticWallet.on', event, handler);
      },
      removeListener: (event: string, handler: (payload: unknown) => void) => {
        console.log('staticWallet.removeListener', event, handler);
      },
    };
  },
  isConnected: async () => {
    return false;
  },
  address: '0xdeb38',
};
export function useAuth(): IWeb3UseAuthHook {
  return staticAuth;
}
export function useWallet(): ConnectedWallet | null {
  return staticWallet;
}
export function useChain(): IWeb3UseChainHook {
  return {
    chain: {
      name: 'dummy',
      blockExplorers: {
        default: {
          url: 'http://localhost:1000',
        },
      },
    },
    chainId: 1,
    address: '0xdeb38',
  };
}
