-- AlterTable
ALTER TABLE "inventory_objects" ADD COLUMN     "comments" TEXT,
ADD COLUMN     "isConditionOk" BOOLEAN,
ADD COLUMN     "onVideoAt" TIMESTAMPTZ;
