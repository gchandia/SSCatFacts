/*
  Warnings:

  - You are about to drop the column `externalFactId` on the `Fact` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `Fact` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Fact` table. All the data in the column will be lost.
  - You are about to drop the `UserLike` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[factText]` on the table `Fact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `factText` to the `Fact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserLike" DROP CONSTRAINT "UserLike_factId_fkey";

-- DropForeignKey
ALTER TABLE "UserLike" DROP CONSTRAINT "UserLike_userId_fkey";

-- DropIndex
DROP INDEX "Fact_externalFactId_key";

-- AlterTable
ALTER TABLE "Fact" DROP COLUMN "externalFactId",
DROP COLUMN "likesCount",
DROP COLUMN "text",
ADD COLUMN     "factText" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserLike";

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "factId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_factId_key" ON "Like"("userId", "factId");

-- CreateIndex
CREATE UNIQUE INDEX "Fact_factText_key" ON "Fact"("factText");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_factId_fkey" FOREIGN KEY ("factId") REFERENCES "Fact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
