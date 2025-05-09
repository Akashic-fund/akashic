"use client";

import React, {
  createContext,
  useContext,
  useMemo
} from "react";
import { useAccount as useWagmiAccount } from "wagmi";
import { type Address, type Chain } from "viem";

type AccountStatusType =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected";
interface AccountContextType {
  address?: Address;
  chain?: Chain;
  chainId?: number;
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  status?: AccountStatusType;
}

const AccountContext = createContext<AccountContextType>({
  isConnected: false,
  isConnecting: false,
  isReconnecting: false,
});

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    address,
    chain,
    chainId,
    isConnected,
    isConnecting,
    isReconnecting,
    status,
  } = useWagmiAccount();
  const normalizedAddress: Address|undefined = useMemo(() => {
    if (
      typeof address !== "string" ||
      !address.toLowerCase().startsWith("0x")
    ) {
      return undefined;
    }
    return address.toLowerCase() as Address;
  }, [address]);

  const value = useMemo(
    () => ({
      address: normalizedAddress,
      chain,
      chainId,
      isConnected,
      isConnecting,
      isReconnecting,
      status,
    }),
    [
      normalizedAddress,
      chain,
      chainId,
      isConnected,
      isConnecting,
      isReconnecting,
      status,
    ],
  );

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => useContext(AccountContext);
