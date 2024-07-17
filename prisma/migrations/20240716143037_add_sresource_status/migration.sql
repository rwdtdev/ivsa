/*
  Warnings:

  - You are about to drop the column `isProcessed` on the `inventory_resources` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceProcessStatus" AS ENUM ('NOT_STARTED', 'IN_PROCCESS', 'PROCESSED');

-- AlterTable
ALTER TABLE "inventory_locations" ALTER COLUMN "dateTime" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "isProcessed",
ADD COLUMN     "status" "ResourceProcessStatus" NOT NULL DEFAULT 'NOT_STARTED',
ALTER COLUMN "endAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "startAt" SET DATA TYPE TIMESTAMPTZ;
