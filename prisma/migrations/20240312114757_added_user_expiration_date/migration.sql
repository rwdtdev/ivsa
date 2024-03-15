/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId,inventoryId,role]` on the table `event-participants` will be added. If there are existing duplicate values, this will fail.

*/

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '1 year';
