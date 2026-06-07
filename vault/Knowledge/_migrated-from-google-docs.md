# Migrated from Google Docs — index of cloud-only originals

- Source(s): the project's `docs/` folder (a symlink to `G:\My Drive\docs`).

## Summary
The `docs/` folder held one readable Markdown file plus several Google Docs (`.gdoc`)
files. **`.gdoc` files are not real documents** — they are ~174-byte pointers into Google
Drive and cannot be read with local file tools (their text lives in Google's cloud). Only
`first-draft.md` was migratable as text → see [[architecture-vision]].

The originals below remain in Google Drive untouched. To bring their full text into the
vault, open each in Google Docs and **File → Download → Markdown**, then paste into a new
`Knowledge/` note. Titles are preserved here as a map.

## Key points — original Google Docs (content NOT migrated; cloud-only)
| Original title | Likely topic | Suggested vault home |
|---|---|---|
| Báo Cáo Nghiên Cứu Khả Thi Và Thiết Kế Kiến Trúc Hệ Sinh Thái Art-Tech Therapy… | Full feasibility study & architecture report | `Knowledge/feasibility-report.md` |
| phase G1 - Milestones | Milestone roadmap | `Projects/art-tech-therapy/` (cross-ref CHANGELOG) |
| HNSW index dùng để làm gì | Why/what HNSW index is for | [[pgvector-hnsw]] |
| Sử dụng từ Entry là hợp lý nhất chưa… | Naming: is "Entry" the right term? | ADR on domain naming |
| what is it/JournalEntry | `JournalEntry` model intent | `Knowledge/` model notes |
| what is it/ArchetypalTag | `ArchetypalTag` model intent | `Knowledge/` model notes |
| why using/…Whisper cho ASR | Rationale: Whisper for ASR | ADR / Knowledge |
| why using/…Vitest…Playwright… | Rationale: Vitest (unit) + Playwright (E2E) | ADR / Knowledge |
| why using/…gọi là Art-Tech Therapy | Rationale: the "Art-Tech Therapy" name | Knowledge |
| first-draft (gdoc duplicate of first-draft.md) | Same as migrated architecture vision | [[architecture-vision]] |

## Related notes
- [[architecture-vision]]
