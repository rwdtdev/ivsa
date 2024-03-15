/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "event-participants_eventId_userId_role_key";

