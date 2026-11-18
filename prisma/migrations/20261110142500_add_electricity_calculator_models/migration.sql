-- CreateEnum
CREATE TYPE "EffortLevel" AS ENUM ('EASY', 'LOW_COST', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "SavingRuleType" AS ENUM ('FIXED_FRACTION', 'REDUCE_HOURS', 'REPLACE_WATTAGE');

-- CreateTable
CREATE TABLE "appliance_categories" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name_la" TEXT NOT NULL,
    "name_en" TEXT,
    "icon_name" TEXT,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "appliance_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appliance_presets" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "name_la" TEXT NOT NULL,
    "name_en" TEXT,
    "default_watt" INTEGER NOT NULL,
    "default_quantity" INTEGER NOT NULL DEFAULT 1,
    "default_hours_per_day" DECIMAL(4,1) NOT NULL DEFAULT 4.0,
    "default_days_per_month" INTEGER NOT NULL DEFAULT 30,
    "is_sample_default" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "appliance_presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saving_action_templates" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "title_la" TEXT NOT NULL,
    "title_en" TEXT,
    "description_la" TEXT NOT NULL,
    "description_en" TEXT,
    "effort_level" "EffortLevel" NOT NULL DEFAULT 'EASY',
    "rule_type" "SavingRuleType" NOT NULL,
    "fixed_fraction" DECIMAL(5,4),
    "reduce_hours_by" DECIMAL(4,1),
    "target_watt_low" INTEGER,
    "target_watt_high" INTEGER,
    "default_selected" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "saving_action_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_notices" (
    "id" SERIAL NOT NULL,
    "notice_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issued_date" DATE NOT NULL,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE NOT NULL,
    "vat_rate" DECIMAL(5,4) NOT NULL DEFAULT 0.10,
    "hot_season_discount_cap_kwh" INTEGER NOT NULL DEFAULT 300,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tariff_notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_schedules" (
    "id" SERIAL NOT NULL,
    "notice_id" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "is_hot_season" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tariff_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tariff_tiers" (
    "id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "tier_order" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "min_kwh" INTEGER NOT NULL,
    "max_kwh" INTEGER,
    "rate_kip_per_kwh" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tariff_tiers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appliance_categories_code_key" ON "appliance_categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "appliance_presets_code_key" ON "appliance_presets"("code");

-- CreateIndex
CREATE INDEX "appliance_presets_category_id_idx" ON "appliance_presets"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "saving_action_templates_code_key" ON "saving_action_templates"("code");

-- CreateIndex
CREATE INDEX "saving_action_templates_category_id_idx" ON "saving_action_templates"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_notices_notice_number_key" ON "tariff_notices"("notice_number");

-- CreateIndex
CREATE INDEX "tariff_schedules_notice_id_idx" ON "tariff_schedules"("notice_id");

-- CreateIndex
CREATE INDEX "tariff_schedules_year_is_hot_season_idx" ON "tariff_schedules"("year", "is_hot_season");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_schedules_year_month_key" ON "tariff_schedules"("year", "month");

-- CreateIndex
CREATE INDEX "tariff_tiers_schedule_id_idx" ON "tariff_tiers"("schedule_id");

-- CreateIndex
CREATE UNIQUE INDEX "tariff_tiers_schedule_id_tier_order_key" ON "tariff_tiers"("schedule_id", "tier_order");

-- AddForeignKey
ALTER TABLE "appliance_presets" ADD CONSTRAINT "appliance_presets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "appliance_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saving_action_templates" ADD CONSTRAINT "saving_action_templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "appliance_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_schedules" ADD CONSTRAINT "tariff_schedules_notice_id_fkey" FOREIGN KEY ("notice_id") REFERENCES "tariff_notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tariff_tiers" ADD CONSTRAINT "tariff_tiers_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "tariff_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
