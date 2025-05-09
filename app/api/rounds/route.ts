import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const rounds = await prisma.round.findMany(); // Fetch all rounds from the database
    return NextResponse.json(rounds, {
      status: 200,
    }); // Return the rounds as JSON
  } catch (error) {
    console.error('Error fetching rounds: ', error);
    return NextResponse.json(
      { error: 'Failed to fetch rounds' },
      { status: 500 },
    ); // Handle errors
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client
  }
}

// New POST handler
export async function POST(req: NextRequest) {
  let body;
  try {
    body = await req.json(); // Parse the JSON body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); // Handle invalid JSON
  }

  const {
    title,
    description,
    tags,
    matchingPool,
    applicationStart,
    applicationClose,
    startDate,
    endDate,
    status,
    blockchain,
    logoUrl,
  } = body;

  // Check if any required fields are missing
  if (
    !title ||
    !description ||
    !tags ||
    !matchingPool ||
    !applicationStart ||
    !applicationClose ||
    !startDate ||
    !endDate ||
    !blockchain ||
    !logoUrl
  ) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  // Validate status against enum values
  const validStatuses = ['NOT_STARTED', 'ACTIVE', 'CLOSED'];
  if (status && !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status value' },
      { status: 400 },
    );
  }

  try {
    const newRound = await prisma.round.create({
      data: {
        title: title,
        description: description,
        tags: tags as string[],
        matchingPool: parseInt(matchingPool),
        applicationStart: new Date(applicationStart),
        applicationClose: new Date(applicationClose),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        blockchain,
        logoUrl,
        strategyAddress: body.strategyAddress || '0x0',
        profileId: body.profileId || 'default-profile',
        managerAddress: body.managerAddress || '0x0',
        tokenAddress: body.tokenAddress || '0x0',
        tokenDecimals: body.tokenDecimals || 18,
      },
    });
    return NextResponse.json(newRound, { status: 201 });
  } catch (error) {
    console.error('Error creating round: ', (error as unknown as Error).stack);
    return NextResponse.json(
      { error: 'Failed to create round' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const { id, title, description, tags, matchingPool, startDate, endDate } =
    await req.json();

  try {
    const updatedRound = await prisma.round.update({
      where: { id },
      data: {
        title,
        description,
        tags,
        matchingPool: parseInt(matchingPool, 10),
        applicationStart: new Date(startDate),
        applicationClose: new Date(endDate),
      },
    });
    return NextResponse.json(updatedRound, { status: 200 });
  } catch (error) {
    console.error('Error updating rounds: ', (error as unknown as Error).stack);
    return NextResponse.json(
      { error: 'Failed to update round' },
      { status: 500 },
    );
  }
}
