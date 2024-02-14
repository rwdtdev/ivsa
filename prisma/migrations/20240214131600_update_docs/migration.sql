/*
  Warnings:

  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tabelNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tabelNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "roles",
ADD COLUMN     "role" "UserRole" NOT NULL,
ADD COLUMN     "tabelNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_tabelNumber_key" ON "users"("tabelNumber");
