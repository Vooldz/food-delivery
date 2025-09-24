-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_license_key" ON "public"."Driver"("license");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "public"."Driver"("userId");

-- CreateIndex
CREATE INDEX "Driver_userId_idx" ON "public"."Driver"("userId");

-- CreateIndex
CREATE INDEX "Driver_createdAt_idx" ON "public"."Driver"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "public"."Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
