/*
  Warnings:

  - You are about to drop the column `institution` on the `Experience` table. All the data in the column will be lost.
  - Added the required column `orgnaisation` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Experience` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "institution",
ADD COLUMN     "orgnaisation" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL;
