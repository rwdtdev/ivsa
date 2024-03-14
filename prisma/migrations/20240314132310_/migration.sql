/*
  Warnings:

  - You are about to drop the column `attributes` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the `event_tabel_numbers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,userId,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "event_tabel_numbers" DROP CONSTRAINT "event_tabel_numbers_eventId_fkey";

-- DropIndex
DROP INDEX "event-participants_eventId_tabelNumber_inventoryId_role_key";

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "attributes";

-- DropTable
DROP TABLE "event_tabel_numbers";

-- CreateTable
CREATE TABLE "InventoryObject" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "inventoryNumber" TEXT,
    "location" TEXT,
    "serialNumber" TEXT,
    "networkNumber" TEXT,
    "passportNumber" TEXT,
    "quantity" INTEGER,
    "state" TEXT,
    "name" TEXT,
    "unitCode" TEXT,
    "unitName" TEXT,
    "batchNumber" TEXT,
    "placement" TEXT,
    "nomenclatureNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryObject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_userId_inventoryId_role_key" ON "event-participants"("eventId", "userId", "inventoryId", "role");

-- AddForeignKey
ALTER TABLE "InventoryObject" ADD CONSTRAINT "InventoryObject_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
