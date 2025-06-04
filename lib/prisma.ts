import { PrismaClient, Prisma } from '@/.generated/prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

function getPrismaLogLevels(): Prisma.LogLevel[] {
  const logLevels = process.env.PRISMA_LOG_LEVELS;
  if (!logLevels) {
    return ['error'];
  }

  const levels = logLevels.split(',').map((level) => level.trim());

  const validLevels: Prisma.LogLevel[] = ['query', 'info', 'warn', 'error'];
  const filteredLevels = levels.filter((level): level is Prisma.LogLevel =>
    validLevels.includes(level as Prisma.LogLevel),
  );

  return filteredLevels.length > 0 ? filteredLevels : ['error'];
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: getPrismaLogLevels(),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
