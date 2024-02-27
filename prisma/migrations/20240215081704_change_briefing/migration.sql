/*
  Warnings:

  - The values [NOT_STARTED,IN_PROGRESS] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `events` table. All the data in the column will be lost.
  - Changed the type of `commandDate` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `orderDate` on the `events` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BriefingStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PASSED');

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('PASSED', 'OPEN', 'CLOSED', 'REMOVED');
ALTER TABLE "events" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "type",
ADD COLUMN     "briefingRoomInviteLink" TEXT,
ADD COLUMN     "briefingStatus" "BriefingStatus" NOT NULL DEFAULT 'NOT_STARTED',
DROP COLUMN "commandDate",
ADD COLUMN     "commandDate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "orderDate",
ADD COLUMN     "orderDate" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "EventType";
