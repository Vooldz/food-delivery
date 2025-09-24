/*
  Warnings:

  - You are about to drop the column `isActive` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."MenuItem_createdAt_isActive_idx";

-- AlterTable
ALTER TABLE "public"."MenuItem" DROP COLUMN "isActive",
ADD COLUMN     "isAvailable" BOOLEAN DEFAULT true;

-- CreateIndex
CREATE INDEX "MenuItem_createdAt_isAvailable_idx" ON "public"."MenuItem"("createdAt" DESC, "isAvailable" DESC);
