/*
  Warnings:

  - You are about to drop the column `hash` on the `inventory_resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "hash",
ADD COLUMN     "metadataHash" TEXT,
ADD COLUMN     "videoHash" TEXT;
