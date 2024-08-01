/*
  Warnings:

  - You are about to drop the column `address` on the `inventory_objects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "inventory_objects" DROP COLUMN "address";
