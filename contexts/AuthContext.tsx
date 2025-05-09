'use client';

import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { adminAddress } from '@/lib/constant';
const debug = process.env.NODE_ENV !== 'production';
import { useAccount } from "./AccountContext";

interface PrivyUser {
  wallet?: {
    address?: string;
  };
}

interface PrivyWallet {
  address?: string;
  isConnected?: () => Promise<boolean>;
  getEthereumProvider: () => Promise<EthereumProvider>;
}

type EthereumProvider = {
  request: (args: { method: string; params?: any[] | undefined }) => Promise<unknown>;
};

interface AuthContextType {
  address: string | null;
  authenticated: boolean;
  user: PrivyUser | null;
  wallet: PrivyWallet | null;
  isAdmin: boolean;
  isClient: boolean;
  login: () => void;
  logout: () => Promise<void>;
  forceWalletConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  address: null,
  authenticated: false,
  user: null,
  wallet: null,
  isAdmin: false,
  isClient: false,
  login: () => {},
  logout: async () => {},
  forceWalletConnection: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address: wagmiAddress } = useAccount();
  const { user, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [isClient, setIsClient] = useState(false);
  const [lastConnectionAttempt, setLastConnectionAttempt] = useState(0);
  
  // Get the primary wallet if available
  const wallet = wallets && wallets.length > 0 ? wallets[0] : null;
  
  // Try to get address from all possible sources
  // Priority: 1. Active wallet from wallets array, 2. User data, 3. Wagmi
  const [address, setAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
    debug && console.log('[AUTH] Client-side rendering active');
  }, []);

  const forceWalletConnection = useCallback(async (): Promise<boolean> => {
    debug && console.log('[AUTH] Forcing wallet connection');
    // Don't attempt more than once every 3 seconds
    const now = Date.now();
    if (now - lastConnectionAttempt < 3000) {
      debug && console.log('[AUTH] Connection attempt too recent, skipping');
      return !!address;
    }
    
    setLastConnectionAttempt(now);
    
    if (!authenticated) {
      debug && console.log('[AUTH] Not authenticated, trying to login');
      login();
      return false;
    }
    
    // If wallet exists, try to connect it
    if (wallet) {
      try {
        debug && console.log('[AUTH] Attempting to connect wallet');
        const isConnected = await wallet.isConnected?.();
        if (!isConnected) {
          // Try to reestablish connection or redirect
          debug && console.log('[AUTH] Wallet not connected, forcing login');
          login();
          return false;
        }
        return true;
      } catch (err) {
        debug && console.error('[AUTH] Error connecting wallet:', err);
        return false;
      }
    } else {
      debug && console.log('[AUTH] No wallet available, forcing login');
      login();
      return false;
    }
  }, [address, authenticated, lastConnectionAttempt, login, wallet]);

  // Update address and admin status when dependencies change
  useEffect(() => {
    const getWalletAddress = async () => {
      if (!isClient) return;
      
      let resolvedAddress = null;
      
      // Try to get from wallets array first
      if (wallet && await wallet.isConnected?.()) {
        try {
          // Some wallet providers expose address directly
          if (wallet.address) {
            resolvedAddress = wallet.address;
          } 
          // Some need to get the signer first
          else {
            const provider = await wallet.getEthereumProvider();
            if (provider && provider?.request) {
              const accounts = await provider.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                resolvedAddress = accounts[0];
              }
            }
          }
        } catch (err) {
          console.error('[AUTH] Error getting wallet address:', err);
        }
      }
      
      // Fall back to other sources if not resolved
      if (!resolvedAddress) {
        resolvedAddress = user?.wallet?.address || wagmiAddress || null;
      }
      
      // Normalize address to lowercase for consistent comparisons
      const normalizedAddress = resolvedAddress ? resolvedAddress.toLowerCase() : null;
      debug && console.log('[AUTH] Final resolved address:', normalizedAddress);
      setAddress(normalizedAddress);
      
      // Update admin status with more detailed logging
      const normalizedAdminAddress = adminAddress ? adminAddress.toLowerCase() : null;
      debug && console.log('[AUTH] Admin check:', {
        userAddress: normalizedAddress,
        adminAddress: normalizedAdminAddress,
        configuredAdminAddress: adminAddress,
        match: !!normalizedAddress && normalizedAddress === normalizedAdminAddress
      });
      
      const adminStatus = !!normalizedAddress && normalizedAddress === normalizedAdminAddress;
      setIsAdmin(adminStatus);
      debug && console.log('[AUTH] Admin status set to:', adminStatus);
    };
    
    getWalletAddress();
  }, [wallet, user, wagmiAddress, wallets, isClient]);

  // Debugging logs
  useEffect(() => {
    if (isClient) {
      debug && console.log('[AUTH DEBUG] wagmiAddress:', wagmiAddress);
      debug && console.log('[AUTH DEBUG] user:', user);
      debug && console.log('[AUTH DEBUG] user.wallet?.address:', user?.wallet?.address);
      debug && console.log('[AUTH DEBUG] wallets:', wallets);
      debug && console.log('[AUTH DEBUG] primary wallet:', wallet);
      debug && console.log('[AUTH DEBUG] authenticated:', authenticated);
      debug && console.log('[AUTH DEBUG] final address:', address);
      debug && console.log('[AUTH DEBUG] isAdmin:', isAdmin);
      debug && console.log('[AUTH DEBUG] adminAddress:', adminAddress);
    }
  }, [wagmiAddress, user, wallets, wallet, authenticated, address, isAdmin, isClient, adminAddress]);

  const value = useMemo(() => ({
    address,
    authenticated,
    user,
    wallet,
    isAdmin,
    isClient,
    login,
    logout,
    forceWalletConnection,
  }), [address, authenticated, user, wallet, isAdmin, isClient, login, logout, forceWalletConnection]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 