/*
  Warnings:

  - A unique constraint covering the columns `[filesystemId,inventoryId,type]` on the table `inventory_resources` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "inventory_resources_id_inventoryId_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "inventory_resources_filesystemId_inventoryId_type_key" ON "inventory_resources"("filesystemId", "inventoryId", "type");
