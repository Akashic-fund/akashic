'use client';

import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

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
        attributes: {
            trait_type: string;
            value: string | number;
        }[];
    };
    verificationData: {
        isValid: boolean;
        recoveredAddress: string;
    };
}

interface NFTResponse {
    success: boolean;
    nid: string;
    nft: NFTData;
}

interface NFTMintingOptions {
    caption: string;
    headline: string;
}

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [assetSignature, setAssetSignature] = useState<SignatureData | null>(null);
    const [nftData, setNftData] = useState<NFTResponse | null>(null);
    const [nftOptions, setNftOptions] = useState<NFTMintingOptions>({
        caption: '',
        headline: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setAssetSignature(null);
            setNftData(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            setIsProcessing(true);
            console.log('Starting file upload...');

            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('/api/numbers-protocol', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Upload response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process image');
            }

            if (!data.success || !data.signatureData) {
                console.warn('Invalid response format:', data);
                throw new Error('Invalid response format from server');
            }

            setAssetSignature(data.signatureData);

            if (data.isValid) {
                console.log('Upload and signature successful:', {
                    signatureData: data.signatureData,
                    rawResponse: data.data
                });
                toast({
                    title: "Success",
                    description: "Image uploaded and signature created successfully!",
                    variant: "default",
                });
            } else {
                console.warn('Upload succeeded but validation failed:', data);
                toast({
                    title: "Warning",
                    description: "Image uploaded but signature validation failed.",
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error("Error processing image:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to process image",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerify = async () => {
        if (!assetSignature) return;

        try {
            setIsVerifying(true);
            console.log('Starting signature verification...');

            const response = await fetch('/api/numbers-protocol/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    integritySha: assetSignature.integritySha,
                    signature: assetSignature.signature,
                    publicKey: assetSignature.publicKey,
                }),
            });

            const data = await response.json();
            console.log('Verification response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to verify signature');
            }

            if (data.isValid) {
                console.log('Signature verified successfully');
                toast({
                    title: "Verification Success",
                    description: "Signature is valid!",
                    variant: "default",
                });
            } else {
                console.warn('Signature verification failed:', {
                    expected: data.expectedAddress,
                    got: data.recoveredAddress
                });
                toast({
                    title: "Verification Failed",
                    description: `Signature is invalid. Expected ${data.expectedAddress}, got ${data.recoveredAddress}`,
                    variant: "destructive",
                });
            }

        } catch (error) {
            console.error("Error verifying signature:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to verify signature",
                variant: "destructive",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleConvertToNFT = async () => {
        if (!selectedFile || !assetSignature) return;

        try {
            setIsConverting(true);
            console.log('Starting NFT minting process...');

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('caption', nftOptions.caption);
            formData.append('headline', nftOptions.headline);
            formData.append('auto_mint', 'true');
            formData.append('auto_product', 'true');
            formData.append('product_price', '10');
            formData.append('product_price_base', 'num');
            formData.append('product_quantity', '3');
            formData.append('product_show_on_explorer', 'false');
            formData.append('signature_data', JSON.stringify(assetSignature));

            console.log('Minting request data:', {
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                fileSize: selectedFile.size,
                caption: nftOptions.caption,
                headline: nftOptions.headline
            });

            const response = await fetch('/api/numbers-protocol/mint-nft', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Minting response:', data);

            if (!response.ok) {
                throw new Error(data.error || data.details || 'Failed to mint NFT');
            }

            if (!data.success || !data.nft) {
                throw new Error('Invalid response format from NFT minting');
            }

            setNftData(data);
            console.log('NFT minted successfully:', data.nft);
            toast({
                title: "Success",
                description: "Asset successfully minted as NFT!",
                variant: "default",
            });

        } catch (error) {
            console.error("Error minting NFT:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to mint NFT",
                variant: "destructive",
            });
        } finally {
            setIsConverting(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-6">Upload Image as NFT</h1>
                
                <div className="space-y-4">
                    <div>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mb-4"
                        />
                    </div>

                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Caption"
                            value={nftOptions.caption}
                            onChange={(e) => setNftOptions(prev => ({ ...prev, caption: e.target.value }))}
                        />
                        <Input
                            type="text"
                            placeholder="Headline"
                            value={nftOptions.headline}
                            onChange={(e) => setNftOptions(prev => ({ ...prev, headline: e.target.value }))}
                        />
                    </div>

                    <div className="flex gap-4 flex-wrap">
                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isProcessing}
                            className="flex-1"
                        >
                            {isProcessing ? "Processing..." : "1. Upload and Sign"}
                        </Button>

                        {assetSignature && (
                            <>
                                <Button
                                    onClick={handleVerify}
                                    disabled={isVerifying}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    {isVerifying ? "Verifying..." : "2. Verify Signature"}
                                </Button>

                                <Button
                                    onClick={handleConvertToNFT}
                                    disabled={isConverting || !nftOptions.caption || !nftOptions.headline}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    {isConverting ? "Minting..." : "3. Mint NFT"}
                                </Button>
                            </>
                        )}
                    </div>

                    {assetSignature && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">Asset Signature:</h2>
                            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                                {JSON.stringify(assetSignature, null, 2)}
                            </pre>
                        </div>
                    )}

                    {nftData && (
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold mb-2">NFT Details:</h2>
                            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                                <p><strong>Asset Link:</strong> <a href={`https://asset.captureapp.xyz/${nftData.nid}`} target="_blank" rel="noopener noreferrer">https://asset.captureapp.xyz/{nftData.nid}</a></p>
                                <p><strong>NID:</strong> {nftData.nid}</p>
                                <p><strong>Network:</strong> {nftData.nft.network}</p>
                                <p><strong>Contract Address:</strong> {nftData.nft.contractAddress}</p>
                                <p><strong>Token ID:</strong> {nftData.nft.tokenId}</p>
                                <p><strong>Name:</strong> {nftData.nft.metadata.name}</p>
                                <p><strong>Description:</strong> {nftData.nft.metadata.description}</p>
                                {nftData.nft.metadata.image && (
                                    <div>
                                        <strong>Image:</strong>
                                        <Image 
                                            src={nftData.nft.metadata.image} 
                                            alt="NFT" 
                                            className="mt-2 max-w-full h-auto rounded"
                                            width={500}
                                            height={500}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Upload;