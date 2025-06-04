import {
  getCsrfToken,
  getSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';

import { SiweMessage } from 'siwe';
import { UserRejectedRequestError } from 'viem';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { chainConfig } from '@/lib/web3/config/chain';
import {
  connector as silkConnector,
  connectorOptions as silkConnectorOptions,
} from '@/lib/web3/adapter/silk/connector';

import { PROJECT_NAME } from '@/lib/constant';
import { useToast } from '@/hooks/use-toast';
import type { IWeb3UseAuthHook } from '@/lib/web3/types';
import { useWeb3Context } from './context-provider';
const debug = false;
/**
 * Handles wagmi connect, signMessage, and logout using the Silk wallet.
 * @returns
 */
export function useAuth(): IWeb3UseAuthHook {
  const [state, setState] = useState<{
    loading?: boolean;
    nonce?: string;
    error?: Error;
  }>({});
  const { toast } = useToast();
  const { address: wagmiAddress, chainId } = useAccount();
  const { connectAsync: wagmiConnect, connectors } = useConnect();
  const { addConnector } = useWeb3Context();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const params = useSearchParams();
  const callbackUrl = params?.get('callbackUrl') || '/dashboard';

  const fetchNonce = useCallback(async () => {
    try {
      const nonce = await getCsrfToken();
      setState((prevState) => ({ ...prevState, nonce }));
    } catch (error) {
      setState((prevState) => ({ ...prevState, error: error as Error }));
    }
  }, []);

  // Pre-fetch random nonce when component using the hook is rendered
  useEffect(() => {
    fetchNonce();
  }, [fetchNonce]);
  useEffect(() => {
    setState((prevState) => ({ ...prevState, loading: true }));
    const loadedSilkConnector = connectors.find(
      (connector) => connector.id === 'silk',
    );
    if (!loadedSilkConnector) {
      addConnector(silkConnector(silkConnectorOptions));
      setState((prevState) => ({ ...prevState, loading: false }));
    } else {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  }, [connectors, addConnector]);
  const address = useMemo(() => {
    debug && console.log('web3/adapter/silk/use-auth:rememo address');
    return wagmiAddress;
  }, [wagmiAddress]);
  const signIn = useCallback(async () => {
    try {
      debug && console.log('useAuth.signIn', { address, chainId });
      if (!address || !chainId) {
        return;
      }

      setState((prevState) => ({
        ...prevState,
        loading: true,
        error: undefined,
      }));
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: `${PROJECT_NAME} - Please sign this message to log in to the app.`,
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      });

      const preparedMessage = message.prepareMessage();
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      const authResult = await nextAuthSignIn('siwe', {
        redirect: false,
        message: JSON.stringify(message),
        signature,
        callbackUrl,
      });
      if (authResult?.ok && !authResult.error) {
        const session = await getSession();
        console.info('User signed in:', session?.user?.name);
      } else if (authResult?.error) {
        const errorMessage =
          'An error occurred while signin in.' +
          ` Code: ${authResult.status} - ${authResult.error}`;
        console.error(errorMessage);
        setState((prevState) => ({
          ...prevState,
          error: new Error(
            authResult.error || 'Unable to authenticate the message',
          ),
        }));
      }

      setState((prevState) => ({ ...prevState, loading: false }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error as Error,
        nonce: undefined,
      }));
      fetchNonce();
    }
  }, [
    address,
    callbackUrl,
    chainId,
    signMessageAsync,
    state.nonce,
    fetchNonce,
  ]);

  const logout = useCallback(async () => {
    return nextAuthSignOut().then(() => {
      disconnect();
      setState({});
    });
  }, [disconnect]);

  const connect = useCallback(async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
      error: undefined,
    }));
    debug && console.log('useAuth.connect');
    const loadedSilkConnector = connectors.find(
      (connector) => connector.id === 'silk',
    );
    const defaultChain = chainConfig.defaultChain;
    try {
      // There should already be a silk connector in the wagmi config which also
      // enables automatic reconnect on page refresh, but just in case, we can also create
      // the connector here.
      if (!loadedSilkConnector) {
        debug && console.log('useAuth.connect: with new silk connector');
        await wagmiConnect({
          // TODO referral code ENV var
          chainId: defaultChain.id,
          connector: silkConnector(silkConnectorOptions),
        });
      } else {
        debug && console.log('useAuth.connect with loadedSilkConnector');
        await wagmiConnect({
          chainId: defaultChain.id,
          connector: loadedSilkConnector,
        });
      }
      setState((prevState) => ({ ...prevState, loading: false }));
    } catch (error) {
      console.error('Error connecting to Silk:', error);
      if (error instanceof UserRejectedRequestError)
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Operation cancelled by user',
        });
      else
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: error as Error,
        }));
    }
  }, [toast, connectors, wagmiConnect]);
  const authenticated = useMemo(() => {
    debug && console.log('web3/adapter/silk/use-auth:rememo authenticated');
    return (
      state.loading === false &&
      typeof address === 'string' &&
      address.length > 0
    );
  }, [state.loading, address]);
  const ready = useMemo(() => {
    debug &&
      console.log(
        'web3/adapter/silk/use-auth:rememo ready',
        state.loading,
        state.error,
      );
    return state.loading === false && !state.error;
  }, [state.loading, state.error]);
  const login = useCallback(async () => {
    await connect();
    await signIn();
  }, [signIn, connect]);
  debug &&
    console.log('web3/adapter/silk/use-auth:render', {
      authenticated,
      ready,
      address,
    });
  return {
    login,
    logout,
    authenticated,
    ready,
    address,
  };
}
