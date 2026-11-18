-- DropIndex
DROP INDEX IF EXISTS "appliance_categories_code_key";

-- DropIndex
DROP INDEX IF EXISTS "appliance_presets_code_key";

-- DropIndex
DROP INDEX IF EXISTS "saving_action_templates_code_key";

-- AlterTable
ALTER TABLE "appliance_categories" DROP COLUMN IF EXISTS "code";

-- AlterTable
ALTER TABLE "appliance_presets" DROP COLUMN IF EXISTS "code";

-- AlterTable
ALTER TABLE "saving_action_templates" DROP COLUMN IF EXISTS "code";
