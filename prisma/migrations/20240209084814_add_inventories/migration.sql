-- AlterTable
ALTER TABLE "users" ADD COLUMN     "inventoryId" TEXT;

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
