/*
  Warnings:

  - You are about to drop the column `departmentId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `DivisionHierarchy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DivisionHierarchyNode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organisations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DivisionHierarchyNode" DROP CONSTRAINT "DivisionHierarchyNode_divisionHierarchyId_fkey";

-- DropForeignKey
ALTER TABLE "departments" DROP CONSTRAINT "departments_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organisationId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "departmentId",
DROP COLUMN "organisationId",
ADD COLUMN     "divisionId" TEXT;

-- DropTable
DROP TABLE "DivisionHierarchy";

-- DropTable
DROP TABLE "DivisionHierarchyNode";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "organisations";

-- CreateTable
CREATE TABLE "division_hierarchies" (
    "id" TEXT NOT NULL,
    "hierId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "parts" INTEGER NOT NULL,
    "titleSh" TEXT NOT NULL,
    "titleMd" TEXT NOT NULL,
    "titleLn" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "division_hierarchies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "division_hierarchies_nodes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "from" TIMESTAMPTZ NOT NULL,
    "to" TIMESTAMPTZ NOT NULL,
    "level" INTEGER NOT NULL,
    "divType" TEXT NOT NULL,
    "titleSh" TEXT NOT NULL,
    "titleMd" TEXT NOT NULL,
    "titleLn" TEXT NOT NULL,
    "bukrs" TEXT NOT NULL,
    "divisionHierarchyId" TEXT NOT NULL,

    CONSTRAINT "division_hierarchies_nodes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "division_hierarchies_nodes" ADD CONSTRAINT "division_hierarchies_nodes_divisionHierarchyId_fkey" FOREIGN KEY ("divisionHierarchyId") REFERENCES "division_hierarchies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
