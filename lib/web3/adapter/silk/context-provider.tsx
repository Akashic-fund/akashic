import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react';

import { config as wagmiConfig } from '@/lib/web3/config/wagmi';
import {
  WagmiProvider,
  createConfig,
  CreateConnectorFn,
  CreateConfigParameters,
} from 'wagmi';
const Web3Context = createContext({
  addConnector: (connector: CreateConnectorFn) => {
    console.warn('Web3ContextProvider not wrapping your component', connector);
  },
});

export function Web3ContextProvider({ children }: { children: ReactNode }) {
  const [connectors, setConnectors] = useState<readonly CreateConnectorFn[]>(
    wagmiConfig.connectors ?? [],
  );

  const config = createConfig({
    chains: wagmiConfig.chains,
    connectors,
    transports: wagmiConfig.transports,
    ssr: wagmiConfig.ssr,
  } as CreateConfigParameters);

  const addConnector = useCallback(
    (newConnector: CreateConnectorFn) => {
      setConnectors(
        (prevState) =>
          [...prevState, newConnector] as readonly CreateConnectorFn[],
      );
    },
    [setConnectors],
  );
  return (
    <WagmiProvider config={config}>
      <Web3Context.Provider value={{ addConnector }}>
        {children}
      </Web3Context.Provider>
    </WagmiProvider>
  );
}
export const useWeb3Context = () => useContext(Web3Context);
