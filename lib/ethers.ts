import { ethers } from 'ethers';
import { AkashicNFTRegistry } from '@/contracts/nftABI/AkashicNFTRegistry';
import { CAMPAIGN_NFT_FACTORY } from '@/lib/constant';
import { AKASHIC_NFT_REGISTRY } from '@/lib/constant';
// import { CampaignNFTabi } from '@/contracts/nftABI/CampaignNFT';
import { CampaignNFTFactory } from '@/contracts/nftABI/CampaignNFTFactory';
// import { NFT_METADATA } from '@/lib/constant';
import { chainConfig } from '@/lib/web3/config/chain';

export const getProvider = () => {
  // For browser environments
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  // Fallback to a public provider
  return new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
};

export const getSigner = async () => {
  const provider = getProvider();

  if (provider instanceof ethers.providers.Web3Provider) {
    // Request account access if needed
    await provider.send('eth_requestAccounts', []);
    return provider.getSigner();
  }

  throw new Error('No signer available. Please connect a wallet.');
};

// Get contract instances
export const getRegistryContract = (
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
) => {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(
    AKASHIC_NFT_REGISTRY,
    AkashicNFTRegistry,
    provider,
  );
};

export const getFactoryContract = (
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
) => {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(
    CAMPAIGN_NFT_FACTORY,
    CampaignNFTFactory,
    provider,
  );
};

export const getCampaignNFTContract = (
  address: string,
  signerOrProvider?: ethers.Signer | ethers.providers.Provider,
) => {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(address, CampaignNFTFactory, provider);
};
