-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin', 'demoAdmin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
    'complete',
    'pending',
    'paid',
    'failed',
    'shipped'
);

-- CreateTable
CREATE TABLE
    "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Session" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "accessToken" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "User" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "usernameUpdatedAt" TIMESTAMP(3),
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "shippingAddress" TEXT,
        "city" TEXT,
        "zipCode" TEXT,
        "addressUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "tokenVersion" INTEGER NOT NULL DEFAULT 0,
        "image" TEXT,
        "password" TEXT,
        "passwordChangedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        "role" "Role" NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "ActiveConnection" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "ipAddress" TEXT,
        "browser" TEXT,
        "browserVersion" TEXT,
        "os" TEXT,
        "osVersion" TEXT,
        "city" TEXT,
        "country" TEXT,
        "lastActive" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ActiveConnection_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "VerificationToken" (
        "id" TEXT NOT NULL,
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "tokenVersion" INTEGER NOT NULL DEFAULT 0,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "PasswordResetToken" (
        "id" TEXT NOT NULL,
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Product" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "badge" TEXT,
        "price" DOUBLE PRECISION NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 0,
        "technical" JSONB NOT NULL,
        "specification" JSONB NOT NULL,
        "performance" JSONB,
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdById" TEXT,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "CartItem" (
        "id" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "cartId" TEXT NOT NULL,
        "productSlug" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Cart" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "BuildItem" (
        "id" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "buildId" TEXT NOT NULL,
        "productSlug" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "BuildItem_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Build" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "public" BOOLEAN NOT NULL DEFAULT false,
        "status" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Build_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "OrderItem" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "quantity" INTEGER NOT NULL,
        CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "Order" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "orderToken" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "phoneNumber" TEXT NOT NULL,
        "totalAmount" DOUBLE PRECISION NOT NULL,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "zipCode" TEXT NOT NULL,
        "stripeSessionId" TEXT,
        "status" "OrderStatus" NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "SystemLog" (
        "id" TEXT NOT NULL,
        "userId" TEXT,
        "action" TEXT NOT NULL,
        "details" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account" ("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session" ("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session" ("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User" ("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveConnection_sessionToken_key" ON "ActiveConnection" ("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken" ("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_identifier_token_key" ON "PasswordResetToken" ("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_productSlug_key" ON "CartItem" ("cartId", "productSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BuildItem_buildId_productSlug_key" ON "BuildItem" ("buildId", "productSlug");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderToken_key" ON "Order" ("orderToken");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveConnection" ADD CONSTRAINT "ActiveConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "Product" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildItem" ADD CONSTRAINT "BuildItem_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildItem" ADD CONSTRAINT "BuildItem_productSlug_fkey" FOREIGN KEY ("productSlug") REFERENCES "Product" ("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Build" ADD CONSTRAINT "Build_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemLog" ADD CONSTRAINT "SystemLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE;