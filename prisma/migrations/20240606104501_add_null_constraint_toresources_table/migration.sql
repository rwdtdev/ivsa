-- AlterTable
ALTER TABLE "inventory_resources" ALTER COLUMN "s3Url" DROP NOT NULL,
ALTER COLUMN "hash" DROP NOT NULL;
