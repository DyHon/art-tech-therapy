import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { transcodeAudio, transcribeAudioFile } from "@/lib/security/media-processor";
import { checkCrisis } from "@/lib/security/shadow-guard";

// Zod schema for direct text entries
const TextEntrySchema = z.object({
  content: z.string().min(1, "Content cannot be empty").max(5000, "Content exceeds 5000 characters limit"),
  entryType: z.enum(["DREAM", "REFLECTION", "ACTIVE_IMAGINATION", "CINEMATIC_RESPONSE"]).default("REFLECTION"),
});

// Zod schema for audio metadata validation
const AudioMetadataSchema = z.object({
  entryType: z.enum(["DREAM", "REFLECTION", "ACTIVE_IMAGINATION", "CINEMATIC_RESPONSE"]).default("DREAM"),
});

export async function POST(req: NextRequest) {
  const requestId = randomUUID();
  const tempDir = path.join(process.cwd(), "temp-media", requestId);
  let rawFilePath = "";
  let transcodedFilePath = "";

  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. DIRECT TEXT ENTRY INGESTION (JSON)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const validation = TextEntrySchema.safeParse(body);
      
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
      }

      const { content, entryType } = validation.data;
      
      // ShadowGuard pre-check before completing ingestion
      const crisisCheck = checkCrisis(content);
      if (crisisCheck.crisis_flag) {
        return NextResponse.json({
          crisis_flag: true,
          redirect: "/safety",
          reason: crisisCheck.reason
        });
      }

      return NextResponse.json({
        success: true,
        entryType,
        clean_transcript: content,
        crisis_flag: false,
        requestId
      });
    }

    // 2. HYPNOPOMPIC AUDIO ENTRY INGESTION (MULTIPART FORM DATA)
    if (contentType.includes("multipart/form-data")) {
      // Parse form data using Next.js native formData()
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

      // Check size limit (10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Audio file exceeds 10MB limit" }, { status: 400 });
      }

      // Ensure temp directory exists
      await fs.promises.mkdir(tempDir, { recursive: true });

      // Identify extension from file name or type
      let ext = ".wav";
      if (file.type.includes("mpeg") || file.type.includes("mp3")) {
        ext = ".mp3";
      } else if (file.type.includes("m4a")) {
        ext = ".m4a";
      }

      rawFilePath = path.join(tempDir, `raw${ext}`);
      transcodedFilePath = path.join(tempDir, "transcoded.mp3");

      // Save uploaded buffer to temp disk file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.promises.writeFile(rawFilePath, buffer);

      // Transcode audio: converts to 16kHz mono, applies high-pass filter
      await transcodeAudio(rawFilePath, transcodedFilePath);

      // Transcribe via Whisper
      const clean_transcript = await transcribeAudioFile(transcodedFilePath);

      // ShadowGuard pre-check on transcribed text
      const crisisCheck = checkCrisis(clean_transcript);
      if (crisisCheck.crisis_flag) {
        return NextResponse.json({
          crisis_flag: true,
          redirect: "/safety",
          reason: crisisCheck.reason
        });
      }

      return NextResponse.json({
        success: true,
        entryType,
        clean_transcript,
        crisis_flag: false,
        requestId
      });
    }

    return NextResponse.json({ error: "Unsupported Content-Type header" }, { status: 415 });

  } catch (error: any) {
    console.error(`[INGEST_ERROR] Request ${requestId} failed:`, error);
    return NextResponse.json({ error: "Failed to process ingestion request", details: error.message }, { status: 500 });

  } finally {
    // 3. MANDATORY ZERO DATA RETENTION (ZDR) PURGE
    if (fs.existsSync(tempDir)) {
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
        console.log(`[ZDR_ENGINE]: Purged transient data for request_id: ${requestId}`);
      } catch (err) {
        console.error(`[ZDR_ENGINE_ERROR]: Failed to delete transient directory: ${tempDir}`, err);
      }
    }
  }
}
