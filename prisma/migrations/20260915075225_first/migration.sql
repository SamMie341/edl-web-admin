/*
  Warnings:

  - You are about to drop the column `district` on the `service_centers` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `service_centers` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `service_centers` table. All the data in the column will be lost.
  - Added the required column `districtId` to the `service_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `service_centers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `villageId` to the `service_centers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_centers" DROP COLUMN "district",
DROP COLUMN "province",
DROP COLUMN "village",
ADD COLUMN     "districtId" INTEGER NOT NULL,
ADD COLUMN     "provinceId" INTEGER NOT NULL,
ADD COLUMN     "villageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "provinces" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "shortName" TEXT,
    "branchCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" INTEGER NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "nameEn" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "villages" (
    "id" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "code" TEXT,
    "name" TEXT,
    "nameEn" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProvinceToVillage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProvinceToVillage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProvinceToVillage_B_index" ON "_ProvinceToVillage"("B");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_centers" ADD CONSTRAINT "service_centers_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_centers" ADD CONSTRAINT "service_centers_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_centers" ADD CONSTRAINT "service_centers_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProvinceToVillage" ADD CONSTRAINT "_ProvinceToVillage_A_fkey" FOREIGN KEY ("A") REFERENCES "provinces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProvinceToVillage" ADD CONSTRAINT "_ProvinceToVillage_B_fkey" FOREIGN KEY ("B") REFERENCES "villages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
