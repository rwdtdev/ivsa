/*
  Warnings:

  - Added the required column `attributes` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL;
