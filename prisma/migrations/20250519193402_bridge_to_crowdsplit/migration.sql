/*
  Warnings:

  - You are about to drop the column `bridgeCustomerId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "bridgeCustomerId",
ADD COLUMN     "crowdsplitCustomerId" TEXT;
