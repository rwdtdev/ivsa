-- AlterTable
ALTER TABLE "users" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '1 year';
