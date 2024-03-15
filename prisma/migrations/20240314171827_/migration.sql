/*
  Warnings:

  - A unique constraint covering the columns `[eventId,inventoryId,tabelNumber]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "event-participants_eventId_userId_inventoryId_role_key";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_inventoryId_tabelNumber_key" ON "event-participants"("eventId", "inventoryId", "tabelNumber");
