/*
  Warnings:

  - You are about to drop the column `videoFileUrl` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event-participants" ADD COLUMN     "inventoryId" TEXT;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "videoFileUrl";

-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
