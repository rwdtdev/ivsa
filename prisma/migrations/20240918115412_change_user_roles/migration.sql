/*
  Warnings:

  - The values [CHAIRMAN,PARTICIPANT,FINANCIALLY_RESPONSIBLE_PERSON,ACCOUNTANT,INSPECTOR,MANAGER,ACCOUNTANT_ACCEPTOR,ENGINEER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [RECUSED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `role` column on the `participants` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('CHAIRMAN', 'PARTICIPANT', 'FINANCIALLY_RESPONSIBLE_PERSON', 'ACCOUNTANT', 'INSPECTOR', 'MANAGER', 'ACCOUNTANT_ACCEPTOR', 'ENGINEER');

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "role",
ADD COLUMN     "role" "ParticipantRole" NOT NULL DEFAULT 'PARTICIPANT';

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'USER', 'TECHNOLOGY_OPERATOR');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'BLOCKED');
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "UserStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "role" SET DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
