/*
  Warnings:

  - You are about to drop the column `fio` on the `event_tabel_numbers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,tabelNumber,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tabelNumber` to the `event-participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `event_tabel_numbers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_userId_fkey";

-- DropIndex
DROP INDEX "event-participants_eventId_userId_inventoryId_role_key";

-- AlterTable
ALTER TABLE "event-participants" ADD COLUMN     "tabelNumber" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "event_tabel_numbers" DROP COLUMN "fio",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_tabelNumber_inventoryId_role_key" ON "event-participants"("eventId", "tabelNumber", "inventoryId", "role");

-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_tabelNumber_fkey" FOREIGN KEY ("tabelNumber") REFERENCES "users"("tabelNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
