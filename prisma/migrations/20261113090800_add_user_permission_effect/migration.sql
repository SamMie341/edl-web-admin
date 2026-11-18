-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PermissionEffect') THEN
        CREATE TYPE "PermissionEffect" AS ENUM ('ALLOW', 'DENY');
    END IF;
END $$;

-- AlterTable
ALTER TABLE "user_permissions" ADD COLUMN IF NOT EXISTS "effect" "PermissionEffect" NOT NULL DEFAULT 'ALLOW';
