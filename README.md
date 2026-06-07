# Art-Tech Therapy 🎭

> A data-driven ecosystem fusing **cinematic art** with **Carl Jung's analytical psychology** —
> turning journals and dreams into a structured, navigable map of the psyche.

Art-Tech Therapy is an "intelligent psychological journal" (codename **The Mirror**). You write
or speak a dream or reflection; the system performs Jungian *symbolic amplification* — surfacing
archetypes (Shadow, Anima/Animus, Self, Trickster…), complexes, and the tension of opposites —
and tracks how your inner landscape evolves over time toward **individuation**.

> [!IMPORTANT]
> **This is not a medical or clinical product.** It does not diagnose, treat, or replace
> professional mental-health care, and it deliberately avoids clinical/DSM-5 language. It is a
> tool for symbolic self-reflection. A built-in safety layer (**ShadowGuard**) intercepts
> crisis sentiment and redirects to real support resources rather than analyzing it. If you are
> in crisis, contact local emergency services or a crisis hotline.

---

## ✨ The three modules

| Module | Role |
|---|---|
| **The Repository** | Stores thought/dream journals (text + audio→text) and auto-tags them with Jungian terms. |
| **The Alchemist** | An AI "neutral mirror" (Gemini) that interprets entries symbolically — anti-sycophantic, never literal, never clinical. |
| **The Constellation** | A dashboard visualizing complexes and the individuation trajectory over time *(in progress — Milestone 5)*. |

## 🔒 Privacy & safety by design

- **Zero Data Retention (ZDR):** raw audio and transcripts are transient — vectorized and analyzed in memory, then purged. Only encrypted analysis + vectors persist.
- **AES-256-GCM** encryption for content at rest; the app **fails fast** if no encryption key is configured (never falls back to a weak key).
- **ShadowGuard** middleware intercepts self-harm / psychosis / crisis sentiment *before* any LLM analysis.
- **Medical redline:** a double guard (prompt + output sanitizer) strips clinical/diagnostic terms.
- **Pluggable AI adapter:** all LLM/embedding calls flow through one interface, so the model/vendor can be swapped — minimizing how many third parties ever touch user text.

## 🧱 Tech stack

Next.js 14+ (App Router, TypeScript) · Tailwind CSS + Framer Motion · PostgreSQL + **pgvector** (HNSW) · Prisma · Google Gemini (analysis + embeddings) · Whisper (ASR) · Zod · Vitest.

## 🗺️ Roadmap

| # | Milestone | Status |
|---|---|---|
| 1 | **Foundation** — Prisma/Postgres schema, pgvector | ✅ |
| 2 | **The Capture Engine** — text + audio ingestion, ZDR purge | ✅ |
| 3 | **The Alchemist** — Gemini symbolic analysis + safety shields | ✅ |
| 4 | **The Red Thread** — vector embeddings + HNSW similarity search | ✅ |
| 5 | **The Mirror** — Constellation dashboard + full ShadowGuard UX | 🚧 next |

The project is currently **backend-first**: the core is the ingestion + analysis API; the visual dashboard arrives in Milestone 5.

---

## 🚀 Getting started

### Prerequisites
- **Node.js** 20+
- **Docker Desktop** (for the pgvector database) — see [`DB_SETUP.md`](./DB_SETUP.md) for a full Windows guide
- A **Google AI Studio** API key — https://aistudio.google.com/app/api-keys

### 1. Install
```bash
git clone https://github.com/DyHon/art-tech-therapy.git
cd art-tech-therapy
npm install
```

### 2. Start the database
```bash
docker compose up -d        # launches pgvector/pgvector:pg16 on localhost:5432
```

### 3. Configure environment
Create a `.env` in the project root (it is gitignored — **never commit it**):
```env
DATABASE_URL="postgresql://therapy_user:therapy_secure_password_2026@localhost:5432/arttech_therapy?schema=public"

# Required. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY="<64-hex-char key>"

# From https://aistudio.google.com/app/api-keys
GEMINI_API_KEY="<your key>"
```

### 4. Apply migrations & run
```bash
npx prisma migrate deploy   # creates tables, the HNSW index, etc.
npm run dev                  # http://localhost:3000
```

### 5. Run the tests
```bash
npx vitest run
```

### Try the ingestion API
```bash
curl -X POST http://localhost:3000/api/journal/ingest \
  -H "Content-Type: application/json" \
  -d '{"content":"I dreamt I was chased through a dark cave by a shadowy figure.","entryType":"DREAM"}'
```
Audio entries: `POST` the same endpoint as `multipart/form-data` with a `file` field.

---

## 📁 Project structure

```
app/                  # Next.js routes & API (BFF)
  api/journal/ingest/ # hybrid text/audio ingestion endpoint
lib/
  ai/                 # IAIEngineAdapter + GeminiAdapter (analysis & embeddings)
  security/           # encryption, ShadowGuard, media processing
  vector/             # The Red Thread — pgvector similarity search
  validations/        # Zod schemas
prisma/               # schema + migrations
tests/                # Vitest suites
vault/                # Obsidian knowledge base (design docs, decisions, session memory)
```

## 📚 Governance & docs

This project is governed by a small set of source-of-truth documents (precedence:
`POLICIES.md` > `CLAUDE.md` > `PROCESS.md` > `PERSONAS.md`). Design rationale, architecture
notes, and decision records (ADRs) live in [`vault/`](./vault) — start with
[`vault/Projects/art-tech-therapy/_STATE.md`](./vault/Projects/art-tech-therapy/_STATE.md).

## 📄 License

No license has been chosen yet — by default, all rights are reserved. A license will be added
before any external contributions are accepted.
