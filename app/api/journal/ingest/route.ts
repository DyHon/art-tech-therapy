import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { transcodeAudio, transcribeAudioFile } from "@/lib/security/media-processor";
import * as ShadowGuard from "@/lib/security/shadow-guard";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/security/encryption";
import { GeminiAdapter } from "@/lib/ai/adapters/gemini.adapter";
import { IAIEngineAdapter } from "@/lib/ai/adapter.interface";
import { TJungianAnalysis } from "@/lib/validations/analysis";
import { persistEmbedding } from "@/lib/vector/red-thread";
import { getUserTimezone } from "@/lib/timezone";

// Zod schema for direct text entries
const TextEntrySchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(5000, "Content exceeds 5000 characters limit"),
  entryType: z.enum(["DREAM", "REFLECTION", "ACTIVE_IMAGINATION", "CINEMATIC_RESPONSE"]).default("REFLECTION"),
});

// Zod schema for audio metadata validation
const AudioMetadataSchema = z.object({
  entryType: z.enum(["DREAM", "REFLECTION", "ACTIVE_IMAGINATION", "CINEMATIC_RESPONSE"]).default("DREAM"),
});

/**
 * Persists the encrypted journal entry, nested archetypal tags, and states a new psychological snapshot.
 */
async function persistJournalAndSnapshot(
  cleanTranscript: string,
  entryType: "DREAM" | "REFLECTION" | "ACTIVE_IMAGINATION" | "CINEMATIC_RESPONSE",
  analysis: TJungianAnalysis
) {
  // 1. Resolve seeker user or seed a default user in development
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "seeker@psyche.net",
        passwordHash: "pbkdf2-placeholder-seeker-hash",
        personaMask: {},
        shadowNodes: []
      }
    });
  }
  
  const userId = user.id;
  const timezone = getUserTimezone(user.personaMask);
  const contentEncrypted = encrypt(cleanTranscript);

  // 2. Create the Journal Entry along with its archetypal tags relational mappings
  const entry = await prisma.journalEntry.create({
    data: {
      userId,
      entryType,
      contentEncrypted,
      analysisJson: analysis as any, // Cast to any for Prisma Json compatibility
      archetypalTags: {
        create: analysis.archetypal_mappings.map(m => ({
          archetypeName: m.archetype,
          intensityScore: m.intensity,
          symbolicMotifs: [m.dream_representation],
          isIntegrated: false
        }))
      }
    }
  });

  // 3. Compute shadow awareness score: ratio of Shadow archetype intensity to 10
  const shadowMapping = analysis.archetypal_mappings.find(
    m => m.archetype.toLowerCase() === "shadow"
  );
  const shadowScore = shadowMapping ? shadowMapping.intensity / 10.0 : 0.5;

  // 4. Create immutable snapshot of functions distribution
  const snapshot = await prisma.userSnapshot.create({
    data: {
      userId,
      psychologicalFunctions: analysis.psychic_tension.function_ratios as any,
      tensionIndex: analysis.psychic_tension.tension_score,
      shadowScore: shadowScore,
      timezone // PROCESS 4.5: localized tz, not blind server UTC
    }
  });

  return { entryId: entry.id, snapshotId: snapshot.id };
}

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  const tempDir = path.join(process.cwd(), "temp-media", requestId);
  let rawFilePath = "";
  let transcodedFilePath = "";
  
  // Transient transcription variable
  let clean_transcript: string | null = null;

  try {
    const contentType = req.headers.get("content-type") || "";
    
    // Instantiating the AI Engine Adapter polymorphically via the interface
    const aiEngine: IAIEngineAdapter = new GeminiAdapter();

    // 1. DIRECT TEXT ENTRY INGESTION (JSON)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const validation = TextEntrySchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
      }

      const { content, entryType } = validation.data;
      clean_transcript = content;
      
      // ShadowGuard pre-check before completing ingestion
      const crisisAnalysis = ShadowGuard.scan(clean_transcript);
      
      if (crisisAnalysis.crisis_flag) {
        // Safe database save of crisis flag (bypasses AI)
        await persistJournalAndSnapshot(clean_transcript, entryType, crisisAnalysis);
        
        return NextResponse.json({
          crisis_flag: true,
          redirect: "/safety",
          reason: "Crisis sentiment detected on semantic boundaries.",
          analysis: crisisAnalysis
        });
      }

      // Safe processing: trigger the Pluggable AI Engine Adapter
      const analysis = await aiEngine.analyze(clean_transcript);

      // Save complete high-fidelity analytical results to relational database
      const { entryId } = await persistJournalAndSnapshot(clean_transcript, entryType, analysis);

      // M4 (The Red Thread): vectorize and persist the embedding BEFORE the ZDR purge,
      // via the adapter (Interface Rule — no direct embedding client in the route).
      await persistEmbedding(entryId, await aiEngine.embed(clean_transcript));

      return NextResponse.json({
        success: true,
        entryId,
        entryType,
        crisis_flag: false,
        analysis,
        requestId
      });
    }

    // 2. HYPNOPOMPIC AUDIO ENTRY INGESTION (MULTIPART FORM DATA)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as Blob | null;
      const entryTypeRaw = formData.get("entryType") || "DREAM";

      const metadataValidation = AudioMetadataSchema.safeParse({ entryType: entryTypeRaw });
      if (!metadataValidation.success) {
        return NextResponse.json({ error: "Invalid entryType parameter" }, { status: 400 });
      }

      const { entryType } = metadataValidation.data;

      if (!file) {
        return NextResponse.json({ error: "Audio file is required" }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Audio file exceeds 10MB limit" }, { status: 400 });
      }

      await fs.promises.mkdir(tempDir, { recursive: true });

      let ext = ".wav";
      if (file.type.includes("mpeg") || file.type.includes("mp3")) {
        ext = ".mp3";
      } else if (file.type.includes("m4a")) {
        ext = ".m4a";
      }

      rawFilePath = path.join(tempDir, `raw${ext}`);
      transcodedFilePath = path.join(tempDir, "transcoded.mp3");

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(rawFilePath, buffer);

      // Transcode audio mono Mono 16kHz
      await transcodeAudio(rawFilePath, transcodedFilePath);

      // Transcribe audio using ASR Engine
      clean_transcript = await transcribeAudioFile(transcodedFilePath);

      // ShadowGuard semantic check
      const crisisAnalysis = ShadowGuard.scan(clean_transcript);
      if (crisisAnalysis.crisis_flag) {
        await persistJournalAndSnapshot(clean_transcript, entryType, crisisAnalysis);
        
        return NextResponse.json({
          crisis_flag: true,
          redirect: "/safety",
          reason: "Crisis sentiment detected on ASR text.",
          analysis: crisisAnalysis
        });
      }

      // Safe deep analysis via Gemini adapter
      const analysis = await aiEngine.analyze(clean_transcript);

      // Persist results securely
      const { entryId } = await persistJournalAndSnapshot(clean_transcript, entryType, analysis);

      // M4 (The Red Thread): vectorize and persist the embedding BEFORE the ZDR purge,
      // via the adapter (Interface Rule — no direct embedding client in the route).
      await persistEmbedding(entryId, await aiEngine.embed(clean_transcript));

      return NextResponse.json({
        success: true,
        entryId,
        entryType,
        crisis_flag: false,
        analysis,
        requestId
      });
    }

    return NextResponse.json({ error: "Unsupported Content-Type header" }, { status: 415 });

  } catch (error: any) {
    console.error(`[INGEST_ERROR] Request ${requestId} failed:`, error);
    return NextResponse.json({ error: "Failed to process ingestion request", details: error.message }, { status: 500 });

  } finally {
    // 3. MANDATORY ZERO DATA RETENTION (ZDR) PURGE
    // Wipe local transient audio files
    if (fs.existsSync(tempDir)) {
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
        console.log(`[ZDR_ENGINE]: Purged transient media files for request_id: ${requestId}`);
      } catch (err) {
        console.error(`[ZDR_ENGINE_ERROR]: Failed to delete transient directory: ${tempDir}`, err);
      }
    }
    
    // Purge clean_transcript from memory completely
    clean_transcript = null;
  }
}
