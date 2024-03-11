-- CreateTable
CREATE TABLE "jobs" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lastStartAt" TIMESTAMP(3),
    "error" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_name_key" ON "jobs"("name");
