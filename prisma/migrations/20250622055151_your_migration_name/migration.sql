/*
  Warnings:

  - You are about to drop the column `Bio` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Bio",
ADD COLUMN     "bio" TEXT DEFAULT 'Passionate Developer',
ADD COLUMN     "github" TEXT DEFAULT '',
ADD COLUMN     "linkedin" TEXT DEFAULT '',
ADD COLUMN     "location" TEXT DEFAULT 'Delhi',
ADD COLUMN     "website" TEXT DEFAULT '';
