/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_inventoryId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "inventoryId";
