/*
  Warnings:

  - You are about to drop the column `address` on the `inventory_resources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_resources" DROP COLUMN "address",
ADD COLUMN     "addresses" TEXT[];
