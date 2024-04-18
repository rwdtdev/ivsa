/*
  Warnings:

  - The `videoFilesUrls` column on the `inventories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "videoFilesUrls",
ADD COLUMN     "videoFilesUrls" TEXT[];
