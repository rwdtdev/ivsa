/*
  Warnings:

  - The values [NOT_STARTED,IN_PROCCESS] on the enum `ResourceProcessStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ResourceProcessStatus_new" AS ENUM ('NOT_PROCESSED', 'IN_PROCESS', 'PROCESSED');
ALTER TABLE "inventory_resources" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inventory_resources" ALTER COLUMN "status" TYPE "ResourceProcessStatus_new" USING ("status"::text::"ResourceProcessStatus_new");
ALTER TYPE "ResourceProcessStatus" RENAME TO "ResourceProcessStatus_old";
ALTER TYPE "ResourceProcessStatus_new" RENAME TO "ResourceProcessStatus";
DROP TYPE "ResourceProcessStatus_old";
ALTER TABLE "inventory_resources" ALTER COLUMN "status" SET DEFAULT 'NOT_PROCESSED';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_resources" ALTER COLUMN "status" SET DEFAULT 'NOT_PROCESSED';
