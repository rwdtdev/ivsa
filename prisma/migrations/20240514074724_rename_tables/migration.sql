/*
  Warnings:

  - You are about to drop the `InventoryLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryObject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InventoryLocation" DROP CONSTRAINT "InventoryLocation_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryObject" DROP CONSTRAINT "InventoryObject_inventoryId_fkey";

-- DropTable
DROP TABLE "InventoryLocation";

-- DropTable
DROP TABLE "InventoryObject";

-- CreateTable
CREATE TABLE "inventory_locations" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_objects" (
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

    CONSTRAINT "inventory_objects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "inventory_locations" ADD CONSTRAINT "inventory_locations_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_objects" ADD CONSTRAINT "inventory_objects_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
