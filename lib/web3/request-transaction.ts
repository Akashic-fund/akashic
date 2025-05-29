import { BigNumber, ethers } from 'ethers';
import { erc20Abi } from 'viem';
import { USDC_ADDRESS } from '@/lib/constant';
import { ConnectedWallet } from '@privy-io/react-auth';

const debug = process.env.NODE_ENV !== 'production';

export async function requestTransaction({
  wallet,
  address,
  amount,
}: {
  wallet: ConnectedWallet;
  address: string;
  amount: string;
}) {
  const privyProvider = await wallet.getEthereumProvider();
  const walletProvider = new ethers.providers.Web3Provider(privyProvider);
  const signer = walletProvider.getSigner();
  const userAddress = await signer.getAddress();
  if (!wallet || !wallet.isConnected()) {
    throw new Error('Wallet not connected');
  }
  if (!USDC_ADDRESS || !ethers.utils.isAddress(USDC_ADDRESS as string)) {
    throw new Error('USDC_ADDRESS is missing or invalid');
  }
  if (!userAddress || !ethers.utils.isAddress(userAddress)) {
    throw new Error('User address is missing or invalid');
  }
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new Error('Donation amount is missing or invalid');
  }
  if (!address || !ethers.utils.isAddress(address)) {
    throw new Error('Treasury address is missing or invalid');
  }
  // Initialize contracts
  debug && console.log('Initializing USDC contract...');
  const usdcContract = new ethers.Contract(
    USDC_ADDRESS as string,
    erc20Abi,
    signer,
  );
  const amountInUSDC = ethers.utils.parseUnits(
    amount || '0',
    process.env.NEXT_PUBLIC_PLEDGE_TOKEN_DECIMALS,
  );
  debug && console.log('Amount in USDC:', amountInUSDC.toString());

  // First approve the treasury to spend USDC
  debug && console.log('Treasury address:', address);
  debug && console.log('Approving USDC spend...');
  const approveTx = await usdcContract.approve(address, amountInUSDC);
  debug && console.log('Approval transaction hash:', approveTx.hash);
  await approveTx.wait();
  debug && console.log('USDC approval confirmed');

  // Make the pledge transaction
  debug && console.log('Initializing treasury contract...');
  const treasuryABI = [
    'function pledgeWithoutAReward(address backer, uint256 pledgeAmount) external returns (bool)',
  ];
  const treasuryContract = new ethers.Contract(address!, treasuryABI, signer);

  debug && console.log('Estimating gas for pledge transaction...');
  let estimatedGas = BigNumber.from(220000);
  try {
    estimatedGas = await treasuryContract.estimateGas.pledgeWithoutAReward(
      userAddress,
      amountInUSDC,
    );
  } catch {}
  debug && console.log('Estimated gas:', estimatedGas.toString());

  debug && console.log('Sending pledge transaction...');
  const tx = await treasuryContract.pledgeWithoutAReward(
    userAddress,
    amountInUSDC,
    {
      gasLimit: estimatedGas.mul(120).div(100),
    },
  );
  debug && console.log('Pledge transaction hash:', tx.hash);
  return tx;
}
