/*
  Warnings:

  - You are about to drop the `EventParticipant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventParticipant" DROP CONSTRAINT "EventParticipant_eventId_fkey";

-- DropTable
DROP TABLE "EventParticipant";

-- CreateTable
CREATE TABLE "event-participants" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,

    CONSTRAINT "event-participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event-participants_eventId_userId_role_key" ON "event-participants"("eventId", "userId", "role");

-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
