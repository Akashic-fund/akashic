import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { integritySha, signature, publicKey } = body;

        if (!integritySha || !signature || !publicKey) {
            return NextResponse.json(
                { error: 'Missing required verification data' },
                { status: 400 }
            );
        }

        console.log('Verifying signature:', {
            integritySha,
            signature,
            publicKey
        });

        // In a real implementation, you would verify the signature against the public key
        // For now, we'll verify that the signature matches our local signing method
        const expectedSignature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(integritySha));
        const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        const isValid = signature === expectedSignatureHex;

        return NextResponse.json({
            success: true,
            isValid,
            verificationData: {
                expectedSignature: expectedSignatureHex,
                providedSignature: signature,
                publicKey
            }
        });

    } catch (error) {
        console.error('Error verifying signature:', error);
        return NextResponse.json(
            { 
                error: 'Failed to verify signature',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 