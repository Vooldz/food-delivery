-- DropIndex
DROP INDEX "public"."Restaurant_userId_key";

-- CreateIndex
CREATE INDEX "Restaurant_name_idx" ON "public"."Restaurant"("name");

-- CreateIndex
CREATE INDEX "Restaurant_userId_idx" ON "public"."Restaurant"("userId");

-- CreateIndex
CREATE INDEX "Restaurant_createdAt_isActive_idx" ON "public"."Restaurant"("createdAt" DESC, "isActive" DESC);
