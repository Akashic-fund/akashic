/*
  Warnings:

  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('BUY', 'SELL');

-- AlterTable - Add column with default value to handle existing records
ALTER TABLE "Payment" ADD COLUMN "type" "PaymentType" NOT NULL DEFAULT 'BUY';

-- Update any existing records that might need different values
-- (You can modify this logic based on your business requirements)
-- For now, all existing payments will be marked as 'BUY'

-- Remove the default constraint after updating existing records
ALTER TABLE "Payment" ALTER COLUMN "type" DROP DEFAULT;
