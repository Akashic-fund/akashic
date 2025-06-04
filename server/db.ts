import { PrismaClient } from '@/.generated/prisma/client';

export {
  Decimal,
  PrismaClientKnownRequestError,
} from '@/.generated/prisma/client/runtime/library';
export type * from '@/.generated/prisma/client';
export { RecipientStatus } from '@/.generated/prisma/client';
const createPrismaClient = () =>
  new PrismaClient({
    log: ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
