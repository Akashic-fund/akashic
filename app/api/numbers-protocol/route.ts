import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        console.log('Received upload request:', {
            fileName: file?.name,
            fileType: file?.type,
            fileSize: file?.size
        });

        if (!file) {
            console.error('No file provided in request');
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Generate a hash of the file
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const proofHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // In a real implementation, you would use a proper key pair for signing
        const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(proofHash));
        const signatureHex = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        //demo public key 
        const demoPublicKey = '0x' + Array(40).fill(0).map(() => 
            Math.floor(Math.random() * 16).toString(16)).join('');

        const formattedResponse = {
            success: true,
            isValid: true,
            signatureData: {
                proofHash,
                provider: "AkashicSignatureProvider",
                signature: signatureHex,
                publicKey: demoPublicKey,
                integritySha: proofHash
            }
        };

        console.log('Local signature generated:', formattedResponse);
        return NextResponse.json(formattedResponse);

    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json(
            { 
                error: 'Failed to process file',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 