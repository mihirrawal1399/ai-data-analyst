-- CreateTable
CREATE TABLE "AutomationResult" (
    "id" TEXT NOT NULL,
    "automationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "output" TEXT,
    "error" TEXT,
    "metrics" JSONB,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER,

    CONSTRAINT "AutomationResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AutomationResult_automationId_idx" ON "AutomationResult"("automationId");

-- AddForeignKey
ALTER TABLE "AutomationResult" ADD CONSTRAINT "AutomationResult_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
