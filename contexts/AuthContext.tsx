'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

const debug = process.env.NODE_ENV !== 'production';
import { ConnectedWallet } from '@/lib/web3/types';
import {
  useAuth as useWeb3Auth,
  useWallet,
  useChain,
} from '@/lib/web3/hooks/use-web3';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  address: string | null;
  authenticated: boolean;
  wallet: ConnectedWallet | null;
  isAdmin: boolean;
  isClient: boolean;
  isReady: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  authenticated: false,
  wallet: null,
  isAdmin: false,
  isClient: false,
  isReady: false,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { address: web3ChainAddress } = useChain();
  const {
    address: web3Address,
    login,
    logout,
    ready: web3Ready,
  } = useWeb3Auth();
  const session = useSession();

  const [isClient, setIsClient] = useState(false);

  // Get the primary wallet if available
  const wallet = useWallet();

  const authenticated = useMemo(() => {
    debug && console.log('contexts/AuthContext: rememo authenticated');
    if (session?.status === 'authenticated') {
      return true;
    }
    return false;
  }, [session]);

  const isReady = useMemo(() => {
    debug && console.log('contexts/AuthContext: rememo isReady');
    if (session.status === 'loading') {
      return false;
    }
    return web3Ready;
  }, [web3Ready, session]);

  const address = useMemo(() => {
    debug && console.log('contexts/AuthContext: rememo address');
    if (!session?.data?.user?.address) {
      return null;
    }
    return session.data.user.address;
  }, [session]);
  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAdmin = useMemo(() => {
    debug && console.log('contexts/AuthContext: rememo isAdmin');
    return session?.data?.user?.roles?.includes('admin') ?? false;
  }, [session]);
  // Debugging logs
  useEffect(() => {
    if (!isClient || !debug) {
      return;
    }
    debug &&
      console.log(
        'contexts/AuthContext: [AUTH DEBUG]',
        JSON.stringify({
          web3ChainAddress,
          web3Address,
          wallet,
          authenticated,
          address,
          isAdmin,
        }),
      );
  }, [
    web3ChainAddress,
    web3Address,
    wallet,
    authenticated,
    address,
    isAdmin,
    isClient,
  ]);

  const value = useMemo(() => {
    return {
      address,
      authenticated,
      isReady,
      wallet,
      isAdmin,
      isClient,
      login,
      logout,
    };
  }, [
    address,
    authenticated,
    isReady,
    wallet,
    isAdmin,
    isClient,
    login,
    logout,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
