-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "plaic_id" TEXT,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);
