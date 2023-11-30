-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" VARCHAR(50) NOT NULL,
    "productId" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "desc" VARCHAR NOT NULL,
    "opt_price" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "barcode" VARCHAR(50) NOT NULL,
    "art" VARCHAR(50) NOT NULL,
    "sizeId" VARCHAR(50) NOT NULL,
    "sizeName" VARCHAR(50) NOT NULL,
    "categoryId" VARCHAR(50),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "main_color" VARCHAR(50) NOT NULL,
    "column_count" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Config_main_color_key" ON "Config"("main_color");

-- CreateIndex
CREATE UNIQUE INDEX "Config_column_count_key" ON "Config"("column_count");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
