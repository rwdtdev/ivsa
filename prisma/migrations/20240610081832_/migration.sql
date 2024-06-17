/*
  Warnings:

  - A unique constraint covering the columns `[id,inventoryId,type]` on the table `inventory_resources` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventory_resources_id_inventoryId_type_key" ON "inventory_resources"("id", "inventoryId", "type");
