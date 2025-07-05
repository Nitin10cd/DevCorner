/*
  Warnings:

  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "pdfUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;
