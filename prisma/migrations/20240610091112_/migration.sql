/*
  Warnings:

  - You are about to drop the column `filesystemId` on the `inventory_resources` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,inventoryId,type]` on the table `inventory_resources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `inventory_resources` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "inventory_resources_filesystemId_inventoryId_type_key";

-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "filesystemId",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "inventory_resources_name_inventoryId_type_key" ON "inventory_resources"("name", "inventoryId", "type");
