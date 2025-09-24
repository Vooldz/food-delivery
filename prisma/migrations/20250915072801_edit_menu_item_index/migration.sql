-- DropIndex
DROP INDEX "public"."MenuItem_createdAt_isAvailable_idx";

-- CreateIndex
CREATE INDEX "MenuItem_isAvailable_createdAt_idx" ON "public"."MenuItem"("isAvailable" DESC, "createdAt" DESC);
