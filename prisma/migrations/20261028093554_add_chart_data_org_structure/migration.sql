-- AlterTable
ALTER TABLE "organization_structures" ADD COLUMN     "chart_data" JSONB,
ALTER COLUMN "image_url" SET DEFAULT '';
