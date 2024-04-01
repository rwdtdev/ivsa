-- CreateTable
CREATE TABLE "InventoryObject" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "inventoryNumber" TEXT,
    "location" TEXT,
    "serialNumber" TEXT,
    "networkNumber" TEXT,
    "passportNumber" TEXT,
    "quantity" INTEGER,
    "state" TEXT,
    "name" TEXT,
    "unitCode" TEXT,
    "unitName" TEXT,
    "batchNumber" TEXT,
    "placement" TEXT,
    "nomenclatureNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryObject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryObject" ADD CONSTRAINT "InventoryObject_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
