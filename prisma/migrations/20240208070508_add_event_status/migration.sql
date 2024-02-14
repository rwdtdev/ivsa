/*
  Warnings:

  - Added the required column `status` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'PASSED', 'OPEN', 'CLOSED', 'REMOVED');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "status" "EventStatus" NOT NULL;
