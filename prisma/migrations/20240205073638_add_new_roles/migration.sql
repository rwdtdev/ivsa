-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'CHAIRMAN';
ALTER TYPE "UserRole" ADD VALUE 'PARTICIPANT';
ALTER TYPE "UserRole" ADD VALUE 'FINANCIALLY_RESPONSIBLE_PERSON';
ALTER TYPE "UserRole" ADD VALUE 'ACCOUNTANT';
ALTER TYPE "UserRole" ADD VALUE 'INSPECTOR';
ALTER TYPE "UserRole" ADD VALUE 'MANAGER';
ALTER TYPE "UserRole" ADD VALUE 'ACCOUNTANT_ACCEPTOR';
ALTER TYPE "UserRole" ADD VALUE 'ENGINEER';

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "videoFileUrl" TEXT;
