/*
  Warnings:

  - You are about to drop the column `address` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `isFilesSaved` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `metadataFileHash` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `metadataFileUrl` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `videoFilesUrls` on the `inventories` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('METADATA', 'VIDEO');

-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "address",
DROP COLUMN "isFilesSaved",
DROP COLUMN "metadataFileHash",
DROP COLUMN "metadataFileUrl",
DROP COLUMN "videoFilesUrls";

-- AlterTable
ALTER TABLE "inventory_locations" ADD COLUMN     "resourceId" TEXT;

-- CreateTable
CREATE TABLE "InventoryResource" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "url" TEXT,
    "s3Url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "address" TEXT,
    "type" "ResourceType" NOT NULL,
    "isProccessed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InventoryResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "InventoryResource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryResource" ADD CONSTRAINT "InventoryResource_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
