import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id; // Get the ID from the query parameters

  try {
    const round = await prisma.round.findUnique({
      where: { id: Number(id) }, // Fetch the round by ID
    });

    if (!round) {
      return NextResponse.json({ error: 'Round not found' }, { status: 404 }); // Handle not found
    }

    return NextResponse.json(round, {
      status: 200,
    }); // Return the round as JSON
  } catch (error) {
    console.error('error fetching round: ', error);
    NextResponse.json(
      { error: 'Failed to fetch round' },
      {
        status: 500,
      },
    ); // Handle errors
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
}
