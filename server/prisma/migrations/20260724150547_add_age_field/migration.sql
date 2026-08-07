/*
  Warnings:

  - Added the required column `age` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN "age" INTEGER NOT NULL DEFAULT 0;

-- Adjust data to remove the default from future inserts via schema
ALTER TABLE "Member" ALTER COLUMN "age" DROP DEFAULT;
