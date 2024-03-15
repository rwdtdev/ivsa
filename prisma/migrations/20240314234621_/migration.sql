/*
  Warnings:

  - You are about to drop the `event-participants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_userId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';

-- DropTable
DROP TABLE "event-participants";

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "inventoryId" TEXT,
    "tabelNumber" TEXT NOT NULL,
    "name" TEXT,
    "userId" TEXT,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_eventId_inventoryId_tabelNumber_key" ON "participants"("eventId", "inventoryId", "tabelNumber");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
