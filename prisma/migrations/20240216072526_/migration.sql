-- AddForeignKey
ALTER TABLE "event-participants" ADD CONSTRAINT "event-participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
