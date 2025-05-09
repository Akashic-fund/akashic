import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { client_id, client_secret } = body;

    if (!client_id || !client_secret) {
      return NextResponse.json(
        { error: 'Missing required credentials' },
        { status: 400 },
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CROWDSPLIT_API_URL}/api/v1/merchant/token/grant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id,
          client_secret,
          grant_type: 'client_credentials',
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get token');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get token' },
      { status: 500 },
    );
  }
}
