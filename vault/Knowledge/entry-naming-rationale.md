# Domain Naming — Why "Entry"

- Source(s): converted (VI→EN) from `docs/Sử dụng từ Entry là hợp lý nhất chưa_ cho tui ý k.._.docx` (Google Doc export).

## Summary

From the combined semantics of both Software Engineering and Jungian (analytical) psychology, "Entry" (as in JournalEntry) is a strong, conventional choice — but it scores only about 8/10 on the "soul" and philosophy of this Art-Tech Therapy system. This note explains why it works from a developer's perspective and proposes more symbolic alternatives (Inscape, Manifestation, Reflection) for the UI and product layer while keeping JournalEntry in the database.

## 1. Why is the word "Entry" reasonable? (Technical perspective)

As a Web Developer, looking at the word "Entry" (in JournalEntry) makes the nature of the thing immediately clear:

- **Convention:** In CMS, Blog, or note-taking applications, "Entry" is the standard word for a single data record that a user enters into the system at a particular moment in time.
- **High inclusiveness:** The word "Entry" encompasses text, voice recording files (audio), and later video and images. It is not narrowly constrained like the word Note or Post.

## 2. Where "Entry" falls short (Depth-psychology perspective)

The weakness of the word "Entry" is that it feels too technical, dry, and mechanical. It makes one think of entering data into an Excel spreadsheet or a rigid raw database.

Meanwhile, our system's philosophy treats the user's life as "A Mythology in Progress." Each time a user opens the app to recount a dream or a thought, they are not "entering data" — they are excavating a fragment from the ocean of the Unconscious up to the surface of Consciousness.

## 3. Alternative proposals to elevate the project's "soul"

If you want to keep familiarity and standardness for other developers (or to make it easy for Antigravity to understand), you can absolutely keep JournalEntry as is.

But if you want the name of the Table/Entity in the Codebase to also exude that deep art-therapy "vibe," consider the following 3 strongly symbolic alternative names:

### Option 1: Inscape (Table: Inscapes) — Score: 10/10

- **Meaning:** A literary English compound word meaning "inner landscape" (as opposed to Landscape, the external natural scenery).
- **Why it's good:** Each time a user writes a journal or recounts a dream, they are capturing a photograph of the "garden of Eden" or the "dark land" inside their mind at that moment. This word is extremely compatible with your dreamy UI and the cinematic funnel (Art Funnel).

### Option 2: Manifestation (Table: Manifestations) — Score: 9/10

- **Meaning:** A revealing, a coming-into-form.
- **Why it's good:** According to Carl Jung, the Unconscious always seeks to manifest outward through symbols in dreams so that Consciousness can recognize them. A journal entry is precisely a "Manifestation of the Unconscious."

### Option 3: Reflection (Table: Reflections) — Score: 9/10

- **Meaning:** A reflecting, a mirroring/illumination.
- **Why it's good:** It aligns perfectly with the name of the MVP Module, "The Mirror." Each act of writing is one more time the user stands before the mirror to look back at themselves.

## Advice from the Architect

- **If you want safety and pragmatism for the Codebase:** Keep JournalEntry as the table name in the Database so that ORM libraries (like Prisma) and the AI Antigravity handle it most smoothly, without confusion.
- **But on the Frontend interface (UI/UX) and Product documentation:** Call those writings Inscapes or Reflections to convey artistic inspiration and create a sense of calm, contemplative reassurance for the customer.

Does the name Inscape (inner landscape) touch exactly the film-director and psychology "vibe" you are aiming for? Let me know how you feel!

(And don't forget to press the "Export to Docs" button to store this naming-rationale puzzle piece into the docs folder on your project Drive!)

## Related notes
- [[data-model-journalentry]]
