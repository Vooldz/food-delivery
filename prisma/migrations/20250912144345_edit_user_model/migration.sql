-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_role_createdAt_idx" ON "public"."User"("role", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt" DESC);
