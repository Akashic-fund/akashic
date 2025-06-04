-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSigninAt" TIMESTAMP(3),
ADD COLUMN     "lastSignoutAt" TIMESTAMP(3),
ADD COLUMN     "prevSigninAt" TIMESTAMP(3),
ADD COLUMN     "roles" TEXT[];
