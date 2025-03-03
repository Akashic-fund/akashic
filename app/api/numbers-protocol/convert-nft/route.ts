import { NextRequest, NextResponse } from 'next/server';
import * as nit from "@numbersprotocol/nit";

const NUMBERS_API_URL = 'https://api.numbersprotocol.io/api/v3/assets/';
const CAPTURE_TOKEN = process.env.NUMBERS_PROTOCOL_TOKEN;
const CAPTURE_API_KEY = process.env.NUMBERS_PROTOCOL_API_KEY;

export async function POST(request: NextRequest) {
    if (!CAPTURE_TOKEN || !CAPTURE_API_KEY) {
        return NextResponse.json(
            { error: 'Numbers Protocol credentials not configured' },
            { status: 500 }
        );
    }

    try {
        const body = await request.json();
        const { assetSignature, file } = body;

        if (!assetSignature) {
            return NextResponse.json(
                { error: 'Missing asset signature' },
                { status: 400 }
            );
        }

        // Verify the signature first
        const verificationResult = await nit.verifyIntegrityHash(
            assetSignature.integritySha,
            assetSignature.signature
        );

        if (verificationResult !== assetSignature.publicKey) {
            return NextResponse.json(
                { error: 'Asset verification failed' },
                { status: 400 }
            );
        }

        // Prepare form data for Numbers Protocol API
        const formData = new FormData();
        formData.append('asset_file', new Blob([file]), file.name);
        formData.append('auto_mint', 'true');
        formData.append('auto_product', 'true');
        formData.append('product_price', '10');
        formData.append('product_price_base', 'num');
        formData.append('product_quantity', '3');
        formData.append('product_show_on_explorer', 'false');

        // Call Numbers Protocol API to mint NFT
        const response = await fetch(NUMBERS_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `token ${CAPTURE_TOKEN}`,
                'X-Api-Key': CAPTURE_API_KEY,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to mint NFT with Numbers Protocol');
        }

        return NextResponse.json({
            success: true,
            nid: data.nid,
            nft: {
                network: data.network,
                contractAddress: data.contract_address,
                tokenId: data.token_id,
                metadata: {
                    name: data.metadata?.name || "Numbers Protocol Asset",
                    description: data.metadata?.description || "Asset created through Numbers Protocol",
                    image: data.metadata?.image || "",
                    attributes: [
                        {
                            trait_type: "Creation Date",
                            value: new Date().toISOString()
                        },
                        {
                            trait_type: "Creator",
                            value: assetSignature.publicKey
                        },
                        {
                            trait_type: "Asset Hash",
                            value: assetSignature.proofHash
                        }
                    ]
                },
                verificationData: {
                    isValid: true,
                    recoveredAddress: verificationResult
                }
            }
        });

    } catch (error) {
        console.error('Error converting to NFT:', error);
        return NextResponse.json(
            { 
                error: 'Failed to mint NFT',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 