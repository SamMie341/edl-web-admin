-- CreateEnum
CREATE TYPE "CommonStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "ServiceCenterStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TEMPORARILY_CLOSED');

-- CreateEnum
CREATE TYPE "StructureType" AS ENUM ('BOARD_OF_DIRECTORS', 'EXECUTIVE_BOARD', 'ORG_STRUCTURE');

-- CreateEnum
CREATE TYPE "VisionMissionType" AS ENUM ('VISION', 'MISSION', 'CORE_VALUES', 'SLOGAN');

-- CreateEnum
CREATE TYPE "ElectricalKnowledgeStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "LegislationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TariffType" AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL');

-- CreateEnum
CREATE TYPE "TariffStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'HISTORICAL');

-- CreateEnum
CREATE TYPE "ProcurementStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED', 'AWARDED');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobPostingStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'EDITOR', 'STAFF');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "branches" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "branches" ALTER COLUMN "status" TYPE "BranchStatus" USING ("status"::"BranchStatus");
ALTER TABLE "branches" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "electrical_knowledge" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "electrical_knowledge" ALTER COLUMN "status" TYPE "ElectricalKnowledgeStatus" USING ("status"::"ElectricalKnowledgeStatus");
ALTER TABLE "electrical_knowledge" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "electricity_tariffs" ALTER COLUMN "tariff_type" TYPE "TariffType" USING ("tariff_type"::"TariffType");
ALTER TABLE "electricity_tariffs" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "electricity_tariffs" ALTER COLUMN "status" TYPE "TariffStatus" USING ("status"::"TariffStatus");
ALTER TABLE "electricity_tariffs" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "job_postings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "job_postings" ALTER COLUMN "status" TYPE "JobPostingStatus" USING ("status"::"JobPostingStatus");
ALTER TABLE "job_postings" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "legislations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "legislations" ALTER COLUMN "status" TYPE "LegislationStatus" USING ("status"::"LegislationStatus");
ALTER TABLE "legislations" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "magazines" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "magazines" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "magazines" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "news" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "news" ALTER COLUMN "status" TYPE "NewsStatus" USING ("status"::"NewsStatus");
ALTER TABLE "news" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "news_categories" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "news_categories" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "news_categories" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "news_tags" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "news_tags" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "news_tags" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "organization_structures" ALTER COLUMN "structure_type" TYPE "StructureType" USING ("structure_type"::"StructureType");
ALTER TABLE "organization_structures" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "organization_structures" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "organization_structures" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "positions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "positions" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "positions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "procurements" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "procurements" ALTER COLUMN "status" TYPE "ProcurementStatus" USING ("status"::"ProcurementStatus");
ALTER TABLE "procurements" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "service_centers" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "service_centers" ALTER COLUMN "status" TYPE "ServiceCenterStatus" USING ("status"::"ServiceCenterStatus");
ALTER TABLE "service_centers" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STAFF';
ALTER TABLE "users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus" USING ("status"::"UserStatus");
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "vision_missions" ALTER COLUMN "entry_type" DROP DEFAULT;
ALTER TABLE "vision_missions" ALTER COLUMN "entry_type" TYPE "VisionMissionType" USING ("entry_type"::"VisionMissionType");
ALTER TABLE "vision_missions" ALTER COLUMN "entry_type" SET DEFAULT 'VISION';
ALTER TABLE "vision_missions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "vision_missions" ALTER COLUMN "status" TYPE "CommonStatus" USING ("status"::"CommonStatus");
ALTER TABLE "vision_missions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
