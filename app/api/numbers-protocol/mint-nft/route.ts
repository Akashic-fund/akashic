import { NextRequest, NextResponse } from 'next/server';

const NUMBERS_API_URL = 'https://api.numbersprotocol.io/api/v3/assets/';
const CAPTURE_TOKEN = process.env.NUMBERS_PROTOCOL_TOKEN;
const CAPTURE_API_KEY = process.env.NUMBERS_PROTOCOL_API_KEY;

export async function POST(request: NextRequest) {
  if (!CAPTURE_TOKEN || !CAPTURE_API_KEY) {
    console.error('Missing Numbers Protocol credentials');
    return NextResponse.json(
      { error: 'Numbers Protocol credentials not configured' },
      { status: 500 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const caption = (formData.get('caption') as string) || '';
    const headline = (formData.get('headline') as string) || '';
    const signatureDataStr = formData.get('signature_data') as string;

    console.log('Received minting request:', {
      fileName: file?.name,
      caption,
      headline,
      hasSignatureData: !!signatureDataStr,
    });

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!signatureDataStr) {
      console.error('No signature data provided in request');
      return NextResponse.json(
        { error: 'No signature data provided' },
        { status: 400 },
      );
    }

    // Parse signature data
    const signatureData = JSON.parse(signatureDataStr);
    console.log('Parsed signature data:', signatureData);

    // Verify that we have all required signature fields
    if (
      !signatureData.proofHash ||
      !signatureData.signature ||
      !signatureData.publicKey
    ) {
      console.error('Invalid signature data:', signatureData);
      return NextResponse.json(
        { error: 'Invalid signature data' },
        { status: 400 },
      );
    }

    // Create a new FormData instance for the Numbers Protocol API
    const numbersFormData = new FormData();

    // Convert File to Blob and append to form data
    const fileArrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileArrayBuffer], { type: file.type });
    numbersFormData.append('asset_file', fileBlob, file.name);

    // Add metadata fields
    numbersFormData.append('caption', caption);
    numbersFormData.append('headline', headline);

    // Add NFT minting fields
    numbersFormData.append('auto_mint', 'true');
    numbersFormData.append('auto_product', 'true');
    numbersFormData.append('product_price', '1');
    numbersFormData.append('product_price_base', 'num');
    numbersFormData.append('product_quantity', '3');
    numbersFormData.append('product_show_on_explorer', 'false');

    console.log('Sending request to Numbers Protocol API with params:', {
      caption,
      headline,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    const response = await fetch(NUMBERS_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `token ${CAPTURE_TOKEN}`,
        'X-Api-Key': CAPTURE_API_KEY,
      },
      body: numbersFormData,
    });

    const data = await response.json();
    console.log(
      'Numbers Protocol API response:',
      JSON.stringify(data, null, 2),
    );

    if (!response.ok) {
      console.error('Numbers Protocol API error:', data);
      return NextResponse.json(
        { error: data.detail || data.message || 'Failed to mint NFT' },
        { status: response.status },
      );
    }

    // Format the response to match the frontend's expected structure
    const formattedResponse = {
      success: true,
      nid: data.cid || '',
      nft: {
        network: data.nft_blockchain_name || 'Numbers Mainnet',
        contractAddress: data.nft_contract_address || '',
        tokenId: data.nft_token_id || 0,
        metadata: {
          name: caption || 'Numbers Protocol Asset',
          description: headline || 'Asset created through Numbers Protocol',
          image: data.asset_file || '',
          attributes: [
            {
              trait_type: 'Creator',
              value: data.creator || signatureData.publicKey,
            },
            {
              trait_type: 'Asset Hash',
              value: data.proof_hash || signatureData.proofHash,
            },
            {
              trait_type: 'Creation Time',
              value: data.uploaded_at || new Date().toISOString(),
            },
            {
              trait_type: 'Owner',
              value: data.owner || signatureData.publicKey,
            },
          ],
        },
        verificationData: {
          isValid: true,
          recoveredAddress:
            data.owner_addresses?.asset_wallet_address ||
            signatureData.publicKey,
        },
      },
      signatureData: {
        proofHash: data.proof_hash,
        provider: 'numbers-protocol',
        signature: signatureData.signature,
        publicKey:
          data.owner_addresses?.asset_wallet_address || signatureData.publicKey,
        integritySha: signatureData.integritySha,
      },
      isValid: true,
      rawResponse: data, // Include raw response for debugging
    };

    console.log(
      'Formatted response:',
      JSON.stringify(formattedResponse, null, 2),
    );
    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      {
        error: 'Failed to mint NFT',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
