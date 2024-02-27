/*
  Warnings:

  - Changed the type of `role` on the `event-participants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "event-participants" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_userId_role_key" ON "event-participants"("eventId", "userId", "role");
