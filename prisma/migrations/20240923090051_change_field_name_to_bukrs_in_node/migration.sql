/*
  Warnings:

  - You are about to drop the column `burks` on the `DivisionHierarchyNode` table. All the data in the column will be lost.
  - Added the required column `bukrs` to the `DivisionHierarchyNode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DivisionHierarchyNode" DROP COLUMN "burks",
ADD COLUMN     "bukrs" CHAR(4) NOT NULL;
