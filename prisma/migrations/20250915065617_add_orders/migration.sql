-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled', 'declined');

-- DropIndex
DROP INDEX "public"."MenuItem_createdAt_idx";

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'pending',
    "statusUpdatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "estimatedDeliveryTime" TIMESTAMP(3),
    "deliveryAddress" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "public"."Order"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "public"."Order"("userId");

-- CreateIndex
CREATE INDEX "Order_restaurantId_idx" ON "public"."Order"("restaurantId");

-- CreateIndex
CREATE INDEX "MenuItem_createdAt_isActive_idx" ON "public"."MenuItem"("createdAt" DESC, "isActive" DESC);

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
