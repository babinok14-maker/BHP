-- CreateTable
CREATE TABLE "PdfFile" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdfFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PdfFile_memberId_idx" ON "PdfFile"("memberId");

-- AddForeignKey
ALTER TABLE "PdfFile" ADD CONSTRAINT "PdfFile_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
