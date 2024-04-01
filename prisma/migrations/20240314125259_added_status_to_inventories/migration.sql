-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'REMOVED');

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateTable
CREATE TABLE "individual-inventories" (
    "id" TEXT NOT NULL,
    "parentInventoryId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attributes" JSONB NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "individual-inventories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "individual-inventories" ADD CONSTRAINT "individual-inventories_parentInventoryId_fkey" FOREIGN KEY ("parentInventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
