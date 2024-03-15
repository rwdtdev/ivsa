/*
  Warnings:

  - A unique constraint covering the columns `[eventId,tabelNumber,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tabelNumber` to the `event-participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_userId_fkey";

-- AlterTable
ALTER TABLE "event-participants" ADD COLUMN     "tabelNumber" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;


-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_tabelNumber_fkey" FOREIGN KEY ("tabelNumber") REFERENCES "users"("tabelNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
