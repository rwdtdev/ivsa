/*
  Warnings:

  - You are about to drop the `operations_records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subsystems` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('USER_CREATE', 'USER_EDIT', 'USER_CHANGE_ROLE', 'USER_LOGIN', 'USER_LOGOUT', 'USER_DOWNLOAD_FILE', 'USER_LOGGED_INTO_BRIEFING_CONFERENCE', 'USER_LOGGED_INTO_AUDIT_CONFERENCE', 'USER_REQUEST_PASSWORD_RESET', 'USER_BLOCK_BY_LIMIT_LOGIN_ATTEMPTS', 'ADMIN_USER_PASSWORD_RESET', 'ADMIN_USER_BLOCK', 'SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_START', 'SYSTEM_MOVE_RESOURCES_TO_OPERATIVE_STORAGE_END', 'SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_START', 'SYSTEM_MOVE_RESOURCES_FROM_OPERATIVE_TO_ARCHIVE_STORAGE_END', 'SOI_EVENT_CREATE', 'SOI_AUDIT_OPEN', 'SOI_AUDIT_CLOSE', 'SOI_BRIEFING_OPEN', 'SOI_BRIEFING_CLOSE', 'SOI_EVENT_PARTICIPANTS_CHANGE', 'SOI_CHECK_USERS');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "SystemActionType" AS ENUM ('CREATE_EVENT', 'CREATE_INVENTORY');

-- DropTable
DROP TABLE "operations_records";

-- DropTable
DROP TABLE "subsystems";

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "actionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ActionType" NOT NULL,
    "status" "ActionStatus" NOT NULL,
    "initiator" TEXT NOT NULL,
    "ip" TEXT,
    "details" JSONB,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);
