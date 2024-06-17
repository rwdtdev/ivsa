/*
  Warnings:

  - Added the required column `filesystemId` to the `inventory_resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_resources" ADD COLUMN     "filesystemId" TEXT NOT NULL;
