/*
  Warnings:

  - You are about to drop the column `lastRunAt` on the `Automation` table. All the data in the column will be lost.
  - You are about to drop the column `payload` on the `Automation` table. All the data in the column will be lost.
  - Added the required column `config` to the `Automation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Automation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Automation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Automation" DROP COLUMN "lastRunAt",
DROP COLUMN "payload",
ADD COLUMN     "config" JSONB NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dashboardId" TEXT,
ADD COLUMN     "datasetId" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastRun" TIMESTAMP(3),
ADD COLUMN     "nextRun" TIMESTAMP(3),
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Automation_userId_idx" ON "Automation"("userId");

-- CreateIndex
CREATE INDEX "Automation_enabled_nextRun_idx" ON "Automation"("enabled", "nextRun");

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_datasetId_fkey" FOREIGN KEY ("datasetId") REFERENCES "Dataset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
