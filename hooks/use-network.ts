'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { chainConfig } from '@/lib/web3/config/chain';
import { useWallet } from '@/lib/web3/hooks/use-web3';
import { EthereumProvider, ProviderRpcError } from '@/lib/web3/types';

export function useNetworkCheck() {
  const wallet = useWallet();
  const { toast } = useToast();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = useCallback(async (provider: EthereumProvider) => {
    try {
      const chainId = await provider.request({ method: 'eth_chainId' });
      const correctNetwork = chainId === chainConfig.chainId.hex;
      setIsCorrectNetwork(correctNetwork);
      return correctNetwork;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
      return false;
    }
  }, []);

  const switchToAlfajores = useCallback(async () => {
    if (!wallet) {
      return;
    }
    if (!(await wallet.isConnected())) {
      return;
    }

    try {
      const provider = await wallet.getEthereumProvider();
      const chainIdHex = chainConfig.chainId.hex;

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        await checkNetwork(provider);
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (
          typeof switchError === 'object' &&
          switchError !== null &&
          'code' in switchError &&
          (switchError as ProviderRpcError).code === 4902
        ) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [chainConfig.getAddChainParams()],
            });
            // Check network again after adding
            await checkNetwork(provider);
          } catch (addError) {
            console.error('Error adding network:', addError);
            throw new Error('Failed to add network');
          }
        } else {
          console.error('Error switching network:', switchError);
          throw new Error('Failed to switch network');
        }
      }
    } catch (error) {
      console.error('Error switching network:', error);
      toast({
        title: 'Network Switch Failed',
        description:
          'Failed to switch to ' +
          chainConfig.name +
          ' network.' +
          ' Please try switching manually in your wallet.',
        variant: 'destructive',
      });
    }
  }, [wallet, toast, checkNetwork]);

  useEffect(() => {
    if (!wallet) {
      console.log('use-network:effect: no wallet');
      return;
    }

    let cleanup: (() => void) | undefined;

    const initializeNetwork = async () => {
      try {
        if (!(await wallet.isConnected())) {
          console.log('use-network:effect: wallet not connected');
          setIsCorrectNetwork(false);
          return;
        }
        const provider = await wallet.getEthereumProvider();

        // Initial network check
        await checkNetwork(provider);

        // Listen for network changes
        const handleChainChanged = async (newChainId: unknown) => {
          console.log('use-network:effect: handleChainChanged', newChainId);
          const isCorrect = newChainId === chainConfig.chainId.hex;
          setIsCorrectNetwork(isCorrect);
        };

        provider.on('chainChanged', handleChainChanged);
        cleanup = () =>
          provider.removeListener('chainChanged', handleChainChanged);
      } catch (error) {
        console.error('Error initializing network check:', error);
        setIsCorrectNetwork(false);
      }
    };

    initializeNetwork();
    return () => cleanup?.();
  }, [wallet, checkNetwork]);

  return { isCorrectNetwork, switchToAlfajores };
}
