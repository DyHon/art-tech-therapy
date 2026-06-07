# Changelog

All notable changes to the **art-tech-therapy** project are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Milestone 5a — `/safety` crisis route:** the ShadowGuard redirect destination, with
  grounding exercises (breathing + 5-4-3-2-1) and curated crisis support resources;
  soft/minimalist UI with Framer Motion (reduced-motion aware).
- **Milestone 4 — The Red Thread (core):** `IAIEngineAdapter.embed()` (Gemini
  `gemini-embedding-001` @1536 via `@google/genai`), `persistEmbedding` /
  `findSimilarEntries` (raw-SQL cosine search), HNSW index `idx_journal_entry_vector_hnsw`,
  and `UserSnapshot.timezone` (localized snapshots, PROCESS 4.5). Migration
  `20260607120000_m4_red_thread` (apply with `prisma migrate deploy`).
- Obsidian vault as persistent cross-session memory (`vault/`), with `_STATE.md`,
  session logs, ADRs, Knowledge notes, and a `/save` command.
- Project design docs translated from Vietnamese Google Docs into English
  `vault/Knowledge/` notes.

### Changed
- Governance: added a precedence chain (POLICIES > CLAUDE > PROCESS > PERSONAS) and a
  Karpathy-inspired Engineering Discipline section to `CLAUDE.md`.

### Fixed
- **Encryption hardening (`lib/security/encryption.ts`):** removed the hardcoded
  fallback key (now fails fast when `ENCRYPTION_KEY` is unset); `decrypt` now throws on
  malformed/forged input instead of silently returning the ciphertext.

## [0.1.0] - 2026-06-07
_Baseline at vault creation — reflects Milestones 1–3 as already implemented._

### Added
- M1: Prisma + PostgreSQL schema with pgvector extension; `User`, `JournalEntry`,
  `ArchetypalTag`, `UserSnapshot` models; `embedding vector(1536)` column declared.
- M2: Hybrid text/audio ingestion route (`app/api/journal/ingest/route.ts`) with
  fluent-ffmpeg transcode, Whisper ASR (mocked), ShadowGuard crisis pre-check, and a
  Zero-Data-Retention purge of transient media.
- M3: Pluggable AI engine via `IAIEngineAdapter` + `GeminiAdapter`, Zod-validated
  Jungian analysis schema, and a double medical-diagnostic redline.
- AES-256-GCM encryption helper and AES-backed content-at-rest storage.
