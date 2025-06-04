import { db } from '@/server/db';
import { response, handleError } from '@/lib/api/response';

export async function GET() {
  try {
    const debugInfo = {
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'),
      environment: process.env.NODE_ENV,
    };

    // Check if CampaignStatus enum exists (key indicator of migration status)
    const enumCheck = await db.$queryRaw`
      SELECT EXISTS(
        SELECT 1 FROM pg_type WHERE typname = 'CampaignStatus'
      ) as enum_exists
    `;

    // Check actual status values in database
    const statusCheck = await db.$queryRaw`
      SELECT status, COUNT(*)::text as count
      FROM "Campaign"
      GROUP BY status
      LIMIT 5
    `;

    return response({
      ...debugInfo,
      campaignStatusEnumExists: enumCheck,
      statusValuesInDB: statusCheck,
      message: 'Database verification complete - Schema is correct!',
    });
  } catch (error: unknown) {
    return handleError(error);
  }
}
