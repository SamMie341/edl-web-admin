-- CreateTable
CREATE TABLE "Carousel" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "status" "CommonStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Carousel_pkey" PRIMARY KEY ("id")
);
