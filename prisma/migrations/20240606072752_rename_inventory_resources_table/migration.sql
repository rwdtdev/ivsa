/*
  Warnings:

  - You are about to drop the `InventoryResource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryResource" DROP CONSTRAINT "InventoryResource_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "inventory_locations" DROP CONSTRAINT "inventory_locations_resourceId_fkey";

-- DropTable
DROP TABLE "InventoryResource";

-- CreateTable
CREATE TABLE "inventory_resources" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "url" TEXT,
    "s3Url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "address" TEXT,
    "type" "ResourceType" NOT NULL,
    "isProccessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "inventory_resources_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "inventory_resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_resources" ADD CONSTRAINT "inventory_resources_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
