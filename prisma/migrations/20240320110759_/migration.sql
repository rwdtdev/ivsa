/*
  Warnings:

  - You are about to drop the column `videoFiles` on the `inventories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "videoFiles",
ADD COLUMN     "isFilesSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "operatingStorageUrl" TEXT,
    "operatingStorageSaveAt" TIMESTAMP(3),
    "archiveStorageUrl" TEXT,
    "archiveStorageSaveAt" TIMESTAMP(3),
    "transferAt" TIMESTAMP(3),

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
