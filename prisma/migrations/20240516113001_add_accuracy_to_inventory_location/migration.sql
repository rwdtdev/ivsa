/*
  Warnings:

  - Added the required column `accuracy` to the `inventory_locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_locations" ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL;
