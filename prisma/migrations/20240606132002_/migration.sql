/*
  Warnings:

  - You are about to drop the column `isProccessed` on the `inventory_resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "isProccessed",
ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false;
