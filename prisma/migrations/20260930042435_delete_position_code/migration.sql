/*
  Warnings:

  - You are about to drop the column `position_code` on the `positions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "positions_position_code_key";

-- AlterTable
ALTER TABLE "positions" DROP COLUMN "position_code";
