-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
