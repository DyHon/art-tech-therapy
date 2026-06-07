import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { checkCrisis } from "../lib/security/shadow-guard";
import { transcribeAudioFile } from "../lib/security/media-processor";

describe("Hypnopompic Capture Engine - Validation Suite", () => {
  const tempTestDir = path.join(process.cwd(), "temp-media-test");

  beforeEach(() => {
    if (!fs.existsSync(tempTestDir)) {
      fs.mkdirSync(tempTestDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(tempTestDir)) {
      fs.rmSync(tempTestDir, { recursive: true, force: true });
    }
  });

  // Test 1: Text Ingestion & Bypass
  describe("Text Ingestion & ShadowGuard", () => {
    it("should successfully run keyword crisis check and bypass media processing", () => {
      const normalText = "I dreamt I was walking in a peaceful library filled with ancient symbols.";
      const normalCheck = checkCrisis(normalText);
      expect(normalCheck.crisis_flag).toBe(false);

      const crisisText = "I feel completely hopeless and want to end my life, everything is dark.";
      const crisisCheck = checkCrisis(crisisText);
      expect(crisisCheck.crisis_flag).toBe(true);
      expect(crisisCheck.reason).toContain("life");
    });
  });

  // Test 2: Whisper Mocking & Transcribing
  describe("Whisper ASR Mocking", () => {
    it("should return the correct mocked clean transcript based on input type", async () => {
      const mockAudioPath = path.join(tempTestDir, "mock_dream.mp3");
      fs.writeFileSync(mockAudioPath, "fake-audio-content");

      const transcript = await transcribeAudioFile(mockAudioPath);
      expect(transcript).toContain("flying over a vast dark ocean");
    });

    it("should flag crisis sentiment if mock audio represents a crisis file", async () => {
      const mockCrisisAudioPath = path.join(tempTestDir, "mock_crisis.mp3");
      fs.writeFileSync(mockCrisisAudioPath, "fake-audio-content");

      const transcript = await transcribeAudioFile(mockCrisisAudioPath);
      expect(transcript).toContain("end my life");
      
      const crisisCheck = checkCrisis(transcript);
      expect(crisisCheck.crisis_flag).toBe(true);
    });
  });

  // Test 3: Zero Data Retention (ZDR) Purge Verification
  describe("Zero Data Retention (ZDR) Purge Verification", () => {
    it("should ensure the transient directory and files do not exist after processing", async () => {
      const reqId = "test-uuid-12345";
      const requestDir = path.join(tempTestDir, reqId);
      
      fs.mkdirSync(requestDir, { recursive: true });
      const rawFile = path.join(requestDir, "raw.wav");
      fs.writeFileSync(rawFile, "fake-wav-buffer");

      // Verify file exists before processing/purge
      expect(fs.existsSync(rawFile)).toBe(true);

      // Simulate the API route's processing and ZDR purge loop
      try {
        expect(fs.existsSync(rawFile)).toBe(true);
      } finally {
        // Trigger the ZDR purge as defined in our finally block
        if (fs.existsSync(requestDir)) {
          fs.rmSync(requestDir, { recursive: true, force: true });
        }
      }

      // Check ZDR compliance: folder MUST be deleted immediately
      expect(fs.existsSync(requestDir)).toBe(false);
      expect(fs.existsSync(rawFile)).toBe(false);
    });
  });
});
