/*
  Warnings:

  - You are about to drop the column `confrimed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "confrimed",
DROP COLUMN "isActive",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "comfirmed" BOOLEAN NOT NULL DEFAULT false;
