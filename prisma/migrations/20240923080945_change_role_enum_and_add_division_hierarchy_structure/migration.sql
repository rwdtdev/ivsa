/*
  Warnings:

  - The values [ENGINEER] on the enum `ParticipantRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParticipantRole_new" AS ENUM ('CHAIRMAN', 'PARTICIPANT', 'FINANCIALLY_RESPONSIBLE_PERSON', 'ACCOUNTANT', 'INSPECTOR', 'MANAGER', 'ACCOUNTANT_ACCEPTOR');
ALTER TABLE "participants" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "participants" ALTER COLUMN "role" TYPE "ParticipantRole_new" USING ("role"::text::"ParticipantRole_new");
ALTER TYPE "ParticipantRole" RENAME TO "ParticipantRole_old";
ALTER TYPE "ParticipantRole_new" RENAME TO "ParticipantRole";
DROP TYPE "ParticipantRole_old";
ALTER TABLE "participants" ALTER COLUMN "role" SET DEFAULT 'PARTICIPANT';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'DEVELOPER';
ALTER TYPE "UserRole" ADD VALUE 'USER_ADMIN';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isTemporaryPassword" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "DivisionHierarchy" (
    "id" TEXT NOT NULL,
    "hierId" CHAR(30) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "parts" INTEGER NOT NULL,
    "titleSh" CHAR(15) NOT NULL,
    "titleMd" CHAR(60) NOT NULL,
    "titleLn" CHAR(120) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DivisionHierarchy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DivisionHierarchyNode" (
    "id" CHAR(8) NOT NULL,
    "name" CHAR(32) NOT NULL,
    "parentId" CHAR(8) NOT NULL,
    "from" TIMESTAMPTZ NOT NULL,
    "to" TIMESTAMPTZ NOT NULL,
    "level" INTEGER NOT NULL,
    "divType" CHAR(1) NOT NULL,
    "titleSh" CHAR(15) NOT NULL,
    "titleMd" CHAR(60) NOT NULL,
    "titleLn" CHAR(120) NOT NULL,
    "burks" CHAR(4) NOT NULL,
    "divisionHierarchyId" TEXT NOT NULL,

    CONSTRAINT "DivisionHierarchyNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DivisionHierarchyNode" ADD CONSTRAINT "DivisionHierarchyNode_divisionHierarchyId_fkey" FOREIGN KEY ("divisionHierarchyId") REFERENCES "DivisionHierarchy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
