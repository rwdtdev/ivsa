/*
  Warnings:

  - You are about to drop the column `inventoryResourceId` on the `inventory_locations` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_locations" DROP CONSTRAINT "inventory_locations_inventoryResourceId_fkey";

-- AlterTable
ALTER TABLE "inventory_locations" DROP COLUMN "inventoryResourceId";

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "inventory_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
