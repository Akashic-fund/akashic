import { useWallet } from './use-web3';
import { useState, useEffect } from 'react';
import { erc20Abi } from 'viem';
import { USDC_ADDRESS } from '@/lib/constant';
import { ethers } from 'ethers';

export function useUsdcBalance() {
  const wallet = useWallet();
  const [usdcBalance, setUsdcBalance] = useState(0);
  useEffect(() => {
    const fetchUsdcBalance = async () => {
      console.log('fetchUSDCBalance');
      if (wallet && (await wallet.isConnected())) {
        const walletProvider = await wallet.getEthereumProvider();
        const ethersProvider = new ethers.providers.Web3Provider(
          walletProvider,
        );
        const signer = ethersProvider.getSigner();
        const userAddress = await signer.getAddress();
        console.log('fetchUSDCBalance', { userAddress });

        // Initialize USDC contract
        const usdcContract = new ethers.Contract(
          USDC_ADDRESS as string,
          erc20Abi,
          signer,
        );
        console.log('fetchUSDCBalance', { usdcContract });

        // Fetch balance
        const balance = await usdcContract.balanceOf(userAddress);
        console.log('fetchUSDCBalance', { balance });
        setUsdcBalance(
          parseFloat(
            ethers.utils.formatUnits(
              balance,
              process.env.NEXT_PUBLIC_PLEDGE_TOKEN_DECIMALS,
            ),
          ),
        );
      }
    };

    fetchUsdcBalance();
  }, [wallet]);
  return usdcBalance;
}
