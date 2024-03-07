-- CreateTable
CREATE TABLE "event_tabel_numbers" (
    "tabelNumber" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bindingAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE INDEX "event_tabel_numbers_eventId_tabelNumber_idx" ON "event_tabel_numbers"("eventId", "tabelNumber");

-- CreateIndex
CREATE UNIQUE INDEX "event_tabel_numbers_tabelNumber_eventId_key" ON "event_tabel_numbers"("tabelNumber", "eventId");

-- AddForeignKey
ALTER TABLE "event_tabel_numbers" ADD CONSTRAINT "event_tabel_numbers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
