/*
  Warnings:

  - The primary key for the `DivisionHierarchyNode` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DivisionHierarchy" ALTER COLUMN "hierId" SET DATA TYPE TEXT,
ALTER COLUMN "titleSh" SET DATA TYPE TEXT,
ALTER COLUMN "titleMd" SET DATA TYPE TEXT,
ALTER COLUMN "titleLn" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "DivisionHierarchyNode" DROP CONSTRAINT "DivisionHierarchyNode_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "parentId" SET DATA TYPE TEXT,
ALTER COLUMN "divType" SET DATA TYPE TEXT,
ALTER COLUMN "titleSh" SET DATA TYPE TEXT,
ALTER COLUMN "titleMd" SET DATA TYPE TEXT,
ALTER COLUMN "titleLn" SET DATA TYPE TEXT,
ALTER COLUMN "bukrs" SET DATA TYPE TEXT,
ADD CONSTRAINT "DivisionHierarchyNode_pkey" PRIMARY KEY ("id");
