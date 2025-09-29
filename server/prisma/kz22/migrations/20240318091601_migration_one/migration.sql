-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

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
    "active" BOOLEAN NOT NULL DEFAULT false,
    "barcode" VARCHAR(50) NOT NULL,
    "art" VARCHAR(50) NOT NULL,
    "sizeId" VARCHAR(50) NOT NULL,
    "sizeName" VARCHAR(50) NOT NULL,
    "categoryId" VARCHAR(50),
    "brandId" VARCHAR(50),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,
    "isInteresting" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" VARCHAR(50) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" VARCHAR(50) NOT NULL,
    "main_color" VARCHAR(20) NOT NULL,
    "column_count" INTEGER NOT NULL,
    "shop_name" VARCHAR DEFAULT 'AtikoWeb.Store',
    "isInteresting" BOOLEAN NOT NULL DEFAULT false,
    "phone" VARCHAR(22) NOT NULL DEFAULT '7086001010',
    "desc" VARCHAR NOT NULL DEFAULT '',

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Config_main_color_key" ON "Config"("main_color");

-- CreateIndex
CREATE UNIQUE INDEX "Config_column_count_key" ON "Config"("column_count");

-- CreateIndex
CREATE UNIQUE INDEX "Config_phone_key" ON "Config"("phone");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
