/*
  Warnings:

  - Made the column `assignedAt` on table `Delivery` required. This step will fail if there are existing NULL values in that column.
  - Made the column `driverId` on table `Delivery` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Delivery" DROP CONSTRAINT "Delivery_driverId_fkey";

-- AlterTable
ALTER TABLE "public"."Delivery" ALTER COLUMN "assignedAt" SET NOT NULL,
ALTER COLUMN "assignedAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "driverId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Delivery" ADD CONSTRAINT "Delivery_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
