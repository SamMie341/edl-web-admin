-- DropIndex
DROP INDEX IF EXISTS "tariff_categories_code_key";

-- AlterTable
ALTER TABLE "tariff_categories" DROP COLUMN "code";
