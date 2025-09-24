-- DropIndex
DROP INDEX "public"."User_email_idx";

-- CreateTable
CREATE TABLE "public"."Restaurant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_userId_key" ON "public"."Restaurant"("userId");

-- AddForeignKey
ALTER TABLE "public"."Restaurant" ADD CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
