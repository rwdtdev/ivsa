/*
  Warnings:

  - You are about to drop the column `videographer` on the `inventories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "videographer",
ADD COLUMN     "videographerId" TEXT;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_videographerId_fkey" FOREIGN KEY ("videographerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
