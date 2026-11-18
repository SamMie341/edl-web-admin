-- AlterTable
ALTER TABLE "tariff_notices" ADD COLUMN "maintenance_fee_kip" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tariff_schedules" ADD COLUMN "maintenance_fee_kip" DECIMAL(14,2);
