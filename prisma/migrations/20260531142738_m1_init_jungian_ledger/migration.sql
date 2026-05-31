-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('DREAM', 'REFLECTION', 'ACTIVE_IMAGINATION', 'CINEMATIC_RESPONSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "personaMask" JSONB,
    "shadowNodes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentEncrypted" TEXT NOT NULL,
    "entryType" "EntryType" NOT NULL DEFAULT 'REFLECTION',
    "embedding" vector(1536),
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchetypalTag" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "archetypeName" TEXT NOT NULL,
    "intensityScore" INTEGER NOT NULL,
    "symbolicMotifs" TEXT[],
    "isIntegrated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArchetypalTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "psychologicalFunctions" JSONB NOT NULL,
    "tensionIndex" DECIMAL(4,3) NOT NULL,
    "shadowScore" DECIMAL(4,3) NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "JournalEntry_userId_idx" ON "JournalEntry"("userId");

-- CreateIndex
CREATE INDEX "ArchetypalTag_entryId_idx" ON "ArchetypalTag"("entryId");

-- CreateIndex
CREATE INDEX "UserSnapshot_userId_recordedAt_idx" ON "UserSnapshot"("userId", "recordedAt");

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchetypalTag" ADD CONSTRAINT "ArchetypalTag_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSnapshot" ADD CONSTRAINT "UserSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
