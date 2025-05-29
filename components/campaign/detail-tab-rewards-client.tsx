/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAccount } from '@/contexts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Loader2, Upload as UploadIcon, Check } from 'lucide-react';
import { CAMPAIGN_NFT_FACTORY } from '@/lib/constant';
import { CampaignNFTFactory } from '@/contracts/nftABI/CampaignNFTFactory';
import { CampaignNFTabi } from '@/contracts/nftABI/CampaignNFT';
import { parseEther } from 'viem';
import { ethers } from 'ethers';
import { Badge } from '@/components/ui/badge';
import { chainConfig } from '@/config/chain';

interface CampaignDetailTabRewardsClientProps {
  campaignId: string;
  campaignSlug: string;
  campaignOwner: string;
}
interface SignatureData {
  proofHash: string;
  provider: string;
  signature: string;
  publicKey: string;
  integritySha: string;
}

interface NFTData {
  network: string;
  contractAddress: string;
  tokenId: number;
  metadata: {
    name: string;
    description: string;
    image: string;
  };
}

export function CampaignDetailTabRewardsClient({
  campaignId,
  campaignSlug,
  campaignOwner,
}: CampaignDetailTabRewardsClientProps) {
  const { address, isConnected } = useAccount();
  const [numbersProtocolUri, setNumbersProtocolUri] = useState<string | null>(
    null,
  );
  const [ipfsNid, setIPFSNid] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>('numbers');
  const [step, setStep] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [deployedContractAddress, setDeployedContractAddress] = useState<
    string | null
  >(null);
  const [showMintingInterface, setShowMintingInterface] =
    useState<boolean>(false);
  const [isMintingFromContract, setIsMintingFromContract] =
    useState<boolean>(false);
  // const [campaignId, setCampaignId] = useState<string>('');
  const [campaignName, setCampaignName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [defaultTokenURI, setDefaultTokenURI] = useState<string>('');
  const [minDonationAmount, setMinDonationAmount] = useState<string>('0.01');

  // Add this to your component to store contract details
  const [nftContractDetails, setNftContractDetails] = useState<{
    name: string;
    symbol: string;
    campaignName: string;
    campaignId: string;
    campaignOwner: string;
    campaignTreasury: string;
    campaignDefaultTokenURI: string;
  } | null>(null);

  console.log(campaignId, campaignSlug, address, isConnected);

  const {
    writeContract,
    isPending,
    isSuccess,
    isError,
    data: hash,
    error,
  } = useWriteContract();

  console.log('useWriteContract hash', hash, isSuccess, isError, error);

  // const campaignDetailsResult = useCampaignDetails(campaignId);
  // console.log("campaignDetailsResult", campaignDetailsResult);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  console.log('useWaitForTransactionReceipt', isConfirming, isConfirmed);

  // Handle file selection
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }
    },
    [],
  );

  // Step 1-2: Handle upload and verification
  const handleVerifyImage = useCallback(async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Step 1: Upload to Numbers Protocol
      const response = await fetch('/api/numbers-protocol', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('upload data', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify image');
      }

      if (!data.success || !data.signatureData) {
        console.warn('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }

      setSignatureData(data.signatureData);

      console.log('signatureData', data.signatureData);

      if (data.isValid) {
        console.log('Upload and signature successful:', {
          signatureData: data.signatureData,
          rawResponse: data.data,
        });
        toast({
          title: 'Success',
          description: 'Image uploaded and signature created successfully!',
          variant: 'default',
        });
      } else {
        console.warn('Upload succeeded but validation failed:', data);
        toast({
          title: 'Warning',
          description: 'Image uploaded but signature validation failed.',
          variant: 'destructive',
        });
      }

      // Move to step 3 (NFT minting)
      setStep(3);
    } catch (error) {
      console.error('Error verifying image:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to verify image',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, file]);

  // Step 3: Mint NFT with Numbers Protocol and get nid(ipfs hash)
  const handleMintNFT = useCallback(async () => {
    if (!file || !signatureData) {
      toast({
        title: 'Error',
        description: 'Please verify your image first',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsMinting(true);
      console.log('Starting NFT minting process...');

      // Set up NFT options
      const nftOptions = {
        caption: `Support for ${campaignSlug} campaign`,
        headline: `Verified image for ${campaignSlug}`,
      };

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', nftOptions.caption);
      formData.append('headline', nftOptions.headline);
      formData.append('auto_mint', 'true');
      formData.append('auto_product', 'true');
      formData.append('product_price', '10');
      formData.append('product_price_base', 'num');
      formData.append('product_quantity', '3');
      formData.append('product_show_on_explorer', 'false');
      formData.append('signature_data', JSON.stringify(signatureData));

      console.log('Minting request data:', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        caption: nftOptions.caption,
        headline: nftOptions.headline,
      });

      const response = await fetch('/api/numbers-protocol/mint-nft', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Minting response:', data);

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.details ||
            'Failed to store NFT data : Data Duplication ',
        );
      }

      if (!data.success || !data.nft) {
        throw new Error('Invalid response format from NFT minting');
      }

      setNftData(data.nft);

      console.log('nftData ipfs', data.nid);
      setIPFSNid(data.nid);

      // Store the IPFS URI in localStorage for use with campaign NFT
      const ipfsUri = data.nft.metadata.image;
      localStorage.setItem('numbersProtocolNftUri', ipfsUri);
      localStorage.setItem('ipfsNid', data.nid);
      setNumbersProtocolUri(ipfsUri);
      setIPFSNid(data.nid);

      console.log('NFT minted successfully:', data.nft);
      toast({
        title: 'Success',
        description: 'Asset successfully stored on Numbers Protocol!',
        variant: 'default',
      });

      // Move to step 4
      setStep(4);
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to mint NFT',
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  }, [toast, file, signatureData, campaignSlug]);

  // Step 4: Deploy and mint NFT using Akashic contracts with IPFS hash
  const handleCampaignNFTMint = useCallback(async () => {
    if (!ipfsNid || !address) {
      toast({
        title: 'Error',
        description: 'Missing NFT IPFS hash or wallet not connected',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsDeploying(true);

      // Set up campaign NFT parameters
      setCampaignName(`${campaignSlug} Verified Campaign`);
      setSymbol(`${campaignSlug.substring(0, 4).toUpperCase()}`);
      setDefaultTokenURI(numbersProtocolUri || '');
      setMinDonationAmount('0.01');

      toast({
        title: 'Deploying Campaign NFT',
        description: 'Please confirm the transaction in your wallet',
        variant: 'default',
      });

      // Call the contract deployment function
      const result = writeContract({
        address: CAMPAIGN_NFT_FACTORY as `0x${string}`,
        abi: CampaignNFTFactory,
        functionName: 'createCampaignNFT',
        args: [
          campaignId,
          `${campaignSlug} Verified Campaign`,
          `${campaignSlug.substring(0, 4).toUpperCase()}`,
          ipfsNid || '',
          parseEther('0.01'),
          address || '0x0000000000000000000000000000000000000000',
          address || '0x0000000000000000000000000000000000000000', // Using deployer as treasury
        ],
      });

      console.log('campaignNFT deployed', result);

      // Wait for transaction to be mined
      toast({
        title: 'Transaction Submitted',
        description: `Transaction hash: ${result}`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Error deploying campaign NFT:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to deploy campaign NFT',
        variant: 'destructive',
      });
      setIsDeploying(false);
    }
  }, [
    toast,
    address,
    campaignId,
    campaignSlug,
    ipfsNid,
    numbersProtocolUri,
    writeContract,
  ]);

  // Instead, use a more direct approach with the writeContract hook
  const handleMintFromDeployedContract = useCallback(async () => {
    if (!deployedContractAddress || !address) {
      toast({
        title: 'Error',
        description: 'Contract address not available or wallet not connected',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsMintingFromContract(true);

      // Use the writeContract hook directly
      writeContract({
        address: deployedContractAddress as `0x${string}`,
        abi: CampaignNFTabi, // Import this at the top
        functionName: 'mintSupporterNFT',
        args: [address],
      });

      toast({
        title: 'Minting NFT',
        description: 'Please confirm the transaction in your wallet',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to mint NFT',
        variant: 'destructive',
      });
      setIsMintingFromContract(false);
    }
  }, [toast, address, deployedContractAddress, writeContract]);
  // Update the getNFTContractDetails function to accept an address parameter
  const getNFTContractDetails = useCallback(
    async (contractAddress = deployedContractAddress) => {
      if (!contractAddress) return null;

      try {
        const provider = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcUrl,
        );
        const nftContract = new ethers.Contract(
          contractAddress,
          CampaignNFTabi,
          provider,
        );

        // Fetch contract details
        const contractName = await nftContract.name();
        const contractSymbol = await nftContract.symbol();
        const campaignName = await nftContract.campaignName();
        const campaignDefaultTokenURI = await nftContract.defaultTokenURI();
        const campaignOwner = await nftContract.owner();
        const campaignTreasury = await nftContract.campaignTreasury();

        return {
          name: contractName,
          symbol: contractSymbol,
          campaignName: campaignName,
          campaignId: campaignId,
          campaignOwner: campaignOwner,
          campaignTreasury: campaignTreasury,
          campaignDefaultTokenURI: campaignDefaultTokenURI,
        };
      } catch (error) {
        console.error('Error fetching NFT contract details:', error);
        return null;
      }
    },
    [campaignId, deployedContractAddress],
  );

  // Add a useEffect to handle the minting status
  useEffect(() => {
    // This effect handles the minting status
    if (isSuccess && isMintingFromContract) {
      setIsMintingFromContract(false);
      toast({
        title: 'Success',
        description: 'NFT minted successfully!',
        variant: 'default',
      });
    }

    if (isError && isMintingFromContract) {
      setIsMintingFromContract(false);
      toast({
        title: 'Error',
        description: error?.message || 'Failed to mint NFT',
        variant: 'destructive',
      });
    }
  }, [toast, isSuccess, isError, isMintingFromContract, error]);

  const getNFTAddress = useCallback(
    async (campaignId: string) => {
      try {
        const provider = new ethers.providers.JsonRpcProvider(
          chainConfig.rpcUrl,
        );
        const factoryContract = new ethers.Contract(
          CAMPAIGN_NFT_FACTORY,
          CampaignNFTFactory,
          provider,
        );

        const nftAddress = await factoryContract.getCampaignNFT(campaignId);
        console.log(
          'NFT contract address for campaign',
          campaignId,
          ':',
          nftAddress,
        );

        // Check if the address is valid (not zero address)
        if (
          nftAddress &&
          nftAddress !== '0x0000000000000000000000000000000000000000'
        ) {
          setDeployedContractAddress(nftAddress);

          // Fetch contract details immediately
          const details = await getNFTContractDetails(nftAddress);
          if (details) {
            setNftContractDetails(details);
            setShowMintingInterface(true);
          }

          toast({
            title: 'NFT Contract Found',
            description: `Contract address: ${nftAddress.slice(0, 6)}...${nftAddress.slice(-4)}`,
            variant: 'default',
          });
        } else {
          toast({
            title: 'No NFT Contract',
            description: "This campaign doesn't have an NFT contract yet.",
            variant: 'default',
          });
        }

        return nftAddress;
      } catch (error) {
        console.error('Error getting NFT address:', error);
        toast({
          title: 'Error',
          description: 'Failed to check for NFT contract',
          variant: 'destructive',
        });
        return null;
      }
    },
    [toast, getNFTContractDetails],
  );

  // Add this effect to fetch contract details when address is available
  useEffect(() => {
    if (deployedContractAddress) {
      const fetchContractDetails = async () => {
        const details = await getNFTContractDetails();
        if (details) {
          setNftContractDetails(details);
          setShowMintingInterface(true);
        }
      };

      fetchContractDetails();
    }
  }, [deployedContractAddress, getNFTContractDetails]);

  useEffect(() => {
    if (campaignId) {
      getNFTAddress(campaignId);
      if (deployedContractAddress) {
        setStep(5);
      }
    }
  }, [deployedContractAddress, campaignId, getNFTAddress]);

  // Clear the URI when component unmounts
  useEffect(() => {
    return () => {
      // Don't clear immediately to allow for page navigation
      // localStorage.removeItem('numbersProtocolNftUri');
    };
  }, []);

  // Check if there's a Numbers Protocol NFT URI  & IPFS NID in localStorage
  useEffect(() => {
    const uri = localStorage.getItem('numbersProtocolNftUri');
    const ipfs = localStorage.getItem('ipfsNid');
    console.log('ipfs', ipfs, 'uri', uri);
    if (ipfs) {
      setIPFSNid(ipfs);
      setNumbersProtocolUri(uri);
      setStep(4); // Skip to the final step if we already have a URI
    }
  }, []);

  useEffect(() => {
    // Check for NFT contract when component loads
    if (campaignId && address) {
      getNFTAddress(campaignId);
    }
  }, [campaignId, address, getNFTAddress]);

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="rounded-lg bg-gray-50 p-6 text-center">
          <p className="mb-4">
            Connect your wallet to mint an NFT for this campaign
          </p>
          <Button>Connect Wallet</Button>
        </div>
      ) : (
        <div>
          {deployedContractAddress ? (
            <div className="rounded-lg border bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold">Campaign NFT</h3>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  Contract Deployed
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="md:col-span-2">
                  {previewUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg border">
                      <Image
                        src={previewUrl}
                        alt="NFT Image"
                        width={300}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4 md:col-span-3">
                  <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 font-medium">Contract Details</h4>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Contract Address:</span>
                      <span className="font-mono">
                        {deployedContractAddress.slice(0, 6)}...
                        {deployedContractAddress.slice(-4)}
                      </span>
                    </div>

                    {nftContractDetails && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Name:</span>
                          <span>{nftContractDetails.name.slice(0, 30)}...</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Symbol:</span>
                          <span>{nftContractDetails.symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Campaign Owner:</span>
                          <span>{nftContractDetails.campaignOwner}</span>
                        </div>
                        {/* <div className="flex justify-between text-sm">
                                                            <span className="text-gray-500">Campaign Treasury:</span>
                                                            <span>{nftContractDetails.campaignTreasury}</span>
                                                        </div> */}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Campaign Metadata URI:
                          </span>
                          <span className="">
                            {nftContractDetails?.campaignDefaultTokenURI?.slice(
                              0,
                              35,
                            )}
                            ...
                          </span>
                        </div>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        if (nftContractDetails?.campaignDefaultTokenURI) {
                          navigator.clipboard.writeText(
                            nftContractDetails?.campaignDefaultTokenURI,
                          );
                          toast({
                            title: 'Copied!',
                            description: 'IPFS CID copied to clipboard',
                          });
                        }
                      }}
                    >
                      Copy IPFS CID
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(deployedContractAddress);
                        toast({
                          title: 'Copied!',
                          description: 'Contract address copied to clipboard',
                        });
                      }}
                    >
                      Copy Contract Address
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      onClick={handleMintFromDeployedContract}
                      disabled={isMintingFromContract}
                    >
                      {isMintingFromContract ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Minting NFT...
                        </>
                      ) : (
                        'Mint Campaign NFT'
                      )}
                    </Button>

                    <p className="text-center text-xs text-gray-500">
                      Mint an NFT to show your support for this campaign
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-xl font-bold">Campaign NFT</h3>
              <p className="mb-4">Checking for deployed NFT contract...</p>

              <Button
                onClick={() => getNFTAddress(campaignId)}
                className="mb-4"
              >
                Check NFT Contract
              </Button>

              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  If this campaign has a deployed NFT contract, it will appear
                  here. If not, you may need to deploy one first.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* show when connected address is the owner of the campaign or admin */}
      {address === campaignOwner ||
        (address == '0x1B4AcaBA13f8B3B858c0796A7d62FC35A5ED3BA5' && (
          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="numbers">
                Deploy Your Custom Campaign NFT Contract
              </TabsTrigger>
            </TabsList>
            <TabsContent value="numbers">
              {ipfsNid && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-800">
                    Numbers Protocol Image Detected
                  </h4>
                  <p className="mb-2 text-sm text-green-700">
                    We found an image you uploaded through Numbers Protocol. You
                    can use it to mint your campaign NFT.
                  </p>
                  <p className="truncate text-xs text-green-600">
                    IPFS CID: {ipfsNid}
                  </p>
                </div>
              )}

              <Card className="p-6">
                <p className="mb-6 text-gray-600">
                  Verify your image with Numbers Protocol to ensure authenticity
                  and provenance before minting it as an NFT.
                </p>

                {/* Step 1: Upload Image */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Step 1: Add your file</h4>
                    <p className="mb-4 text-sm text-gray-600">
                      Select an image to upload. This will be verified and
                      minted as an NFT.
                    </p>

                    <div
                      className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {previewUrl ? (
                        <div className="space-y-4">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto rounded-lg object-cover"
                          />
                          <p className="text-sm text-gray-500">{file?.name}</p>
                          <Button
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                              setPreviewUrl(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                          <p className="text-sm font-medium">
                            Click to upload an image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => setStep(2)} disabled={!file}>
                        Continue to Verification
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Image verification on Numbers Protocol */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Step 2: Verify with Numbers Protocol
                    </h4>
                    <p className="mb-4 text-sm text-gray-600">
                      Your image will be verified using Numbers Protocol to
                      ensure authenticity.
                    </p>

                    {previewUrl && (
                      <div className="rounded-lg border p-4">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg object-cover"
                        />
                        <p className="mt-2 text-center text-sm text-gray-500">
                          {file?.name}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button
                        onClick={handleVerifyImage}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify Image'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: uploaded on IPFS using Numbers Protocol */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Step 3: Store NFT on Numbers Protocol
                    </h4>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span>Image successfully verified</span>
                    </div>

                    <p className="mb-4 text-sm text-gray-600">
                      Your image has been verified. Now you can mint it as an
                      NFT with Numbers Protocol.
                    </p>

                    {previewUrl && (
                      <div className="rounded-lg border p-4">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button onClick={handleMintNFT} disabled={isMinting}>
                        {isMinting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Storing Data...
                          </>
                        ) : (
                          'Store NFT Data'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Mint NFT using Akashic contracts */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">
                      Step 4: Mint NFT for your campaign
                    </h4>
                    <div className="flex items-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span> Successfully uploaded NFT data to IPFS</span>
                    </div>

                    <p className="mb-4 text-sm text-gray-600">
                      Your verified image is ready to be minted as a Campaign
                      NFT.
                    </p>

                    {previewUrl && (
                      <div className="rounded-lg border p-4">
                        <Image
                          src={previewUrl}
                          alt="NFT Image"
                          width={200}
                          height={200}
                          className="mx-auto rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h5 className="mb-2 font-medium">NFT Details</h5>
                      <p className="text-xs text-gray-600">
                        IPFS CID: {ipfsNid}
                      </p>
                    </div>

                    {deployedContractAddress ? (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        <h5 className="font-medium">
                          Campaign NFT Contract Deployed
                        </h5>

                        <div className="rounded-md border border-green-200 bg-green-50 p-4">
                          <div className="mb-2 flex items-center space-x-2 text-green-600">
                            <Check className="h-5 w-5" />
                            <span className="font-medium">
                              Contract successfully deployed!
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Contract Address:
                              </span>
                              <span className="font-mono text-sm">
                                {deployedContractAddress.slice(0, 6)}...
                                {deployedContractAddress.slice(-4)}
                              </span>
                            </div>

                            {nftContractDetails && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Name:
                                  </span>
                                  <span className="text-sm">
                                    {nftContractDetails.name}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Symbol:
                                  </span>
                                  <span className="text-sm">
                                    {nftContractDetails.symbol}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Campaign:
                                  </span>
                                  <span className="text-sm">
                                    {nftContractDetails.campaignName}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Total Supply:
                                  </span>
                                  {/* <span className="text-sm">{nftContractDetails.totalSupply}</span> */}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => {
                              // Copy contract address to clipboard
                              navigator.clipboard.writeText(
                                deployedContractAddress,
                              );
                              toast({
                                title: 'Copied!',
                                description:
                                  'Contract address copied to clipboard',
                                variant: 'default',
                              });
                            }}
                          >
                            Copy Address
                          </Button>
                          <Button
                            onClick={handleMintFromDeployedContract}
                            disabled={isMintingFromContract}
                          >
                            {isMintingFromContract ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Minting NFT...
                              </>
                            ) : (
                              'Mint NFT with Verified Image'
                            )}
                          </Button>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          <p>
                            This contract is now registered in the Akashic
                            Registry and can be used to mint NFTs for your
                            campaign.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex justify-between">
                        <Button variant="outline" onClick={() => setStep(3)}>
                          Back
                        </Button>
                        <Button
                          onClick={handleCampaignNFTMint}
                          disabled={isDeploying}
                        >
                          {isDeploying ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deploying Contract...
                            </>
                          ) : (
                            'Deploy your Campaign NFT Contract'
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        ))}
    </div>
  );
}
