interface RequestArguments {
  method: string;
  params?:
    | {
        chainId: string;
        chainName?: string;
        nativeCurrency?: { decimals: number; name: string; symbol: string };
        rpcUrls?: string[];
        blockExplorerUrls?: string[];
      }[]
    | undefined;
}

export type EthereumProvider = {
  request: (args: RequestArguments) => Promise<unknown>;
  on: (event: string, handler: (payload: unknown) => void) => void;
  removeListener: (event: string, handler: (payload: unknown) => void) => void;
};
export interface ProviderRpcError extends Error {
  code: number;
  data?: unknown;
}

export interface ConnectedWallet {
  address?: string;
  isConnected: () => Promise<boolean>;
  getEthereumProvider: () => Promise<EthereumProvider>;
}

export interface IWeb3UseAuthHook {
  address?: string;
  authenticated: boolean;
  login: () => Promise<void>;
  connect?: () => Promise<void>;
  logout: () => Promise<void>;
  ready: boolean;
}
export interface IWeb3UseChainHook {
  chain?: { name?: string; blockExplorers?: { default: { url: string } } };
  chainId?: number;
  address?: `0x${string}`;
}
