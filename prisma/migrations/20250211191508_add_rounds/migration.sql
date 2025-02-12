-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'ACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "Round" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "matchingPool" INTEGER NOT NULL,
    "applicationStart" TIMESTAMP(3) NOT NULL,
    "applicationClose" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "blockchain" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);
