/*
  Warnings:

  - A unique constraint covering the columns `[ivaProfileId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "ivaProfileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_ivaProfileId_key" ON "users"("ivaProfileId");
