-- CreateTable
CREATE TABLE "public"."Delivery" (
    "id" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3),
    "pickedUpAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "driverId" TEXT,

    CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Delivery_orderId_key" ON "public"."Delivery"("orderId");

-- CreateIndex
CREATE INDEX "Delivery_driverId_idx" ON "public"."Delivery"("driverId");

-- CreateIndex
CREATE INDEX "Delivery_orderId_idx" ON "public"."Delivery"("orderId");

-- CreateIndex
CREATE INDEX "Delivery_createdAt_idx" ON "public"."Delivery"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
