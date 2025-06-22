/*
  Warnings:

  - Added the required column `course` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "course" TEXT NOT NULL;
