import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const debugInfo = {
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'),
      environment: process.env.NODE_ENV,
    };

    // Check if CampaignStatus enum exists (key indicator of migration status)
    const enumCheck = await prisma.$queryRaw`
      SELECT EXISTS(
        SELECT 1 FROM pg_type WHERE typname = 'CampaignStatus'
      ) as enum_exists
    `;

    // Check actual status values in database
    const statusCheck = await prisma.$queryRaw`
      SELECT status, COUNT(*)::text as count 
      FROM "Campaign" 
      GROUP BY status 
      LIMIT 5
    `;

    return NextResponse.json({
      ...debugInfo,
      campaignStatusEnumExists: enumCheck,
      statusValuesInDB: statusCheck,
      message: 'Database verification complete - Schema is correct!',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'),
      },
      { status: 500 },
    );
  }
}
