/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_inventoryId_fkey";

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "videoFilesUrls" TEXT[];

-- DropTable
DROP TABLE "File";
