/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `tabelNumber` on the `users` table. All the data in the column will be lost.
  - Added the required column `roles` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_tabelNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
DROP COLUMN "tabelNumber",
ADD COLUMN     "roles" TEXT NOT NULL;
