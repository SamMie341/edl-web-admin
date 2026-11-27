/*
  Warnings:

  - You are about to drop the `Carousel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Carousel";

-- CreateTable
CREATE TABLE "carousels" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "carousels_pkey" PRIMARY KEY ("id")
);
