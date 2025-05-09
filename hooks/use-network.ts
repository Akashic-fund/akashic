"use client"

import { useEffect, useState, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { useToast } from './use-toast';
import { chainConfig } from '@/config/chain';

interface ProviderRpcError extends Error {
    code: number;
    data?: unknown;
}

interface RequestArguments {
    method: string;
    params?: unknown[];
}

type EthereumProvider = {
    request: (args: RequestArguments) => Promise<unknown>;
    on: (event: string, handler: (payload: unknown) => void) => void;
    removeListener: (event: string, handler: (payload: unknown) => void) => void;
};

export function useNetworkCheck() {
    const { wallets } = useWallets();
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
        const wallet = wallets[0];
        if (!wallet?.isConnected()) return;

        try {
            const provider = await wallet.getEthereumProvider() as EthereumProvider;
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
                title: "Network Switch Failed",
                description: "Failed to switch to Celo Alfajores network. Please try switching manually in your wallet.",
                variant: "destructive",
            });
        }
    }, [wallets, toast, checkNetwork]);

    useEffect(() => {
        const wallet = wallets[0];
        if (!wallet?.isConnected()) {
            setIsCorrectNetwork(false);
            return;
        }

        let cleanup: (() => void) | undefined;

        const initializeNetwork = async () => {
            try {
                const provider = await wallet.getEthereumProvider() as EthereumProvider;
                
                // Initial network check
                await checkNetwork(provider);

                // Listen for network changes
                const handleChainChanged = async (newChainId: unknown) => {
                    const isCorrect = newChainId === chainConfig.chainId.hex;
                    setIsCorrectNetwork(isCorrect);
                };

                provider.on('chainChanged', handleChainChanged);
                cleanup = () => provider.removeListener('chainChanged', handleChainChanged);
            } catch (error) {
                console.error('Error initializing network check:', error);
                setIsCorrectNetwork(false);
            }
        };

        initializeNetwork();
        return () => cleanup?.();
    }, [wallets, checkNetwork]);

    return { isCorrectNetwork, switchToAlfajores };
} 