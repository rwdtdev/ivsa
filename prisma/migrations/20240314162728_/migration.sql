/*
  Warnings:

  - You are about to drop the `InventoryObject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `individual-inventories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,userId,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "InventoryObject" DROP CONSTRAINT "InventoryObject_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "individual-inventories" DROP CONSTRAINT "individual-inventories_parentInventoryId_fkey";

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';

-- DropTable
DROP TABLE "InventoryObject";

-- DropTable
DROP TABLE "individual-inventories";

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_userId_inventoryId_role_key" ON "event-participants"("eventId", "userId", "inventoryId", "role");
