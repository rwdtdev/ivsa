-- DropForeignKey
ALTER TABLE "inventory_locations" DROP CONSTRAINT "inventory_locations_resourceId_fkey";

-- AlterTable
ALTER TABLE "inventory_locations" ADD COLUMN     "inventoryResourceId" TEXT;

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_inventoryResourceId_fkey" FOREIGN KEY ("inventoryResourceId") REFERENCES "inventory_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
