/*
  Warnings:

  - You are about to drop the column `type` on the `inventory_resources` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,inventoryId,ivaId]` on the table `inventory_resources` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ivaId` to the `inventory_resources` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "inventory_resources_name_inventoryId_type_key";

-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "type",
ADD COLUMN     "ivaId" TEXT NOT NULL,
ADD COLUMN     "metadataPath" TEXT,
ADD COLUMN     "s3MetadataUrl" TEXT;

-- DropEnum
DROP TYPE "ResourceType";

-- CreateIndex
CREATE UNIQUE INDEX "inventory_resources_name_inventoryId_ivaId_key" ON "inventory_resources"("name", "inventoryId", "ivaId");
