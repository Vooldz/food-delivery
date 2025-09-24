-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "public"."OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_menuItemId_idx" ON "public"."OrderItem"("menuItemId");

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
