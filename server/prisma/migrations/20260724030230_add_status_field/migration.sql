-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('Accepted', 'Pending', 'Rejected');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'Accepted';

-- CreateIndex
CREATE INDEX "Member_status_idx" ON "Member"("status");
