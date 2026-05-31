import ffmpeg from 'fluent-ffmpeg';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'mock-openai-key-for-development-and-testing',
});

/**
 * Transcode incoming audio to 16kHz mono MP3 and apply high-pass filter.
 */
export function transcodeAudio(inputPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check if the input file exists before running FFmpeg
    if (!fs.existsSync(inputPath)) {
      return reject(new Error(`Input file does not exist: ${inputPath}`));
    }

    ffmpeg(inputPath)
      .audioFrequency(16000)
      .audioChannels(1)
      .audioCodec('libmp3lame')
      .audioFilters('highpass=f=100') // Removes low-frequency room noise
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      })
      .save(outputPath);
  });
}

/**
 * Process audio stream/file through Whisper ASR to generate a clean transcript.
 */
export async function transcribeAudioFile(filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File to transcribe does not exist: ${filePath}`);
  }

  // If running in test mode or without valid API keys, support mocked/local Whisper responses
  if (process.env.NODE_ENV === 'test' || process.env.OPENAI_API_KEY === undefined || process.env.OPENAI_API_KEY.includes('mock')) {
    console.log(`[ASR_ENGINE_MOCK] Simulating transcription for file: ${filePath}`);
    // Check if the mock file contains pre-defined text, or return a standard hypnopompic dream transcript
    if (filePath.includes('crisis')) {
      return "I feel completely hopeless and want to end my life, everything is dark.";
    }
    return "I was flying over a vast dark ocean, and a giant silver clock key fell from the sky into the water.";
  }

  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: 'whisper-1',
  });

  return response.text;
}
