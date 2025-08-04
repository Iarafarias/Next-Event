-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_requestId_fkey";

-- AlterTable
ALTER TABLE "certificates" ALTER COLUMN "requestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "certificate_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
