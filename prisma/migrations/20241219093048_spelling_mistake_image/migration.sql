/*
  Warnings:

  - You are about to drop the column `imgae` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "imgae",
ADD COLUMN     "image" TEXT;
