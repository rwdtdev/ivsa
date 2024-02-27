/*
  Warnings:

  - You are about to drop the column `auditInviteLink` on the `inventories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventories" DROP COLUMN "auditInviteLink",
ADD COLUMN     "auditRoomInviteLink" TEXT;
