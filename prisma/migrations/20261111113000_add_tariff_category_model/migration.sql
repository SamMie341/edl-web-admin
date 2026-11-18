-- DropIndex
DROP INDEX IF EXISTS "tariff_schedules_year_month_key";

-- CreateTable
CREATE TABLE "tariff_categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name_la" TEXT NOT NULL,
    "name_en" TEXT,
    "description" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tariff_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tariff_categories_code_key" ON "tariff_categories"("code");

-- Insert Default Tariff Categories (8 Official EDL Categories)
INSERT INTO "tariff_categories" ("id", "code", "name_la", "name_en", "order_index", "status", "created_at", "updated_at")
VALUES
  (1, 'RESIDENTIAL', 'ປະເພດທີ່ຢູ່ອາໄສ', 'Residential / Household', 1, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'COMMERCIAL', 'ປະເພດທຸລະກິດການຄ້າ', 'Commercial / Business', 2, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'ENTERTAINMENT', 'ປະເພດບັນເທີງ', 'Entertainment', 3, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'GOVERNMENT', 'ປະເພດສຳນັກງານລັດຖະບານ', 'Government Office', 4, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 'AGRICULTURE', 'ປະເພດກະສິກຳ ແລະ ຊົນລະປະທານ', 'Agriculture & Irrigation', 5, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 'INTERNATIONAL', 'ປະເພດອົງການຈັດຕັ້ງສາກົນ ແລະ ສະຖານທູດ', 'International Organisations & Embassies', 6, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 'INDUSTRY', 'ປະເພດອຸດສາຫະກຳ', 'Industry', 7, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 'EDUCATION_SPORTS', 'ປະເພດການສຶກສາ ແລະ ກິລາ', 'Education & Sports', 8, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

-- Reset sequence for tariff_categories if needed
SELECT setval(pg_get_serial_sequence('tariff_categories', 'id'), coalesce(max(id), 1)) FROM "tariff_categories";

-- AlterTable tariff_schedules: add category_id with default 1 for existing records
ALTER TABLE "tariff_schedules" ADD COLUMN "category_id" INTEGER DEFAULT 1;

-- Update existing records to link to RESIDENTIAL (1)
UPDATE "tariff_schedules" SET "category_id" = 1 WHERE "category_id" IS NULL;

-- Now enforce NOT NULL
ALTER TABLE "tariff_schedules" ALTER COLUMN "category_id" SET NOT NULL;
ALTER TABLE "tariff_schedules" ALTER COLUMN "category_id" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "tariff_schedules_category_id_idx" ON "tariff_schedules"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_schedules_category_id_year_month_key" ON "tariff_schedules"("category_id", "year", "month");

-- AddForeignKey
ALTER TABLE "tariff_schedules" ADD CONSTRAINT "tariff_schedules_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tariff_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
