-- CreateTable
CREATE TABLE "subsystems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "subsystems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations_records" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "subsystem_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,

    CONSTRAINT "operations_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subsystems_name_key" ON "subsystems"("name");
