-- DropForeignKey
ALTER TABLE "event-participants" DROP CONSTRAINT "event-participants_tabelNumber_fkey";

-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
