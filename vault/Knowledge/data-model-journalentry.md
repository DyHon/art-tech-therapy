# Data Model — JournalEntry

- Source(s): converted (VI→EN) from `docs/what is it_/JournalEntry.docx` (Google Doc export).

## Summary
The JournalEntry table is the "bridge" that links the psychologist's view of a journal (a stream of the unconscious full of symbols and complexes) with the developer's view of it (a secure, queryable Data Object). It stores all of the user's raw entries after they pass through the security filter, encoding each one both as encrypted text and as a mathematical coordinate (vector) that lets the AI connect scattered fragments across time.

## Understanding the JournalEntry table from a system-architecture perspective

To understand the JournalEntry table (the Journal Ledger) from a system-architecture perspective, we first need to distinguish a core difference between two concepts: the Developer's Data and the Psychologist's Data.

- The Psychologist (Jungian school): sees the user's journal as a stream of the Unconscious, full of metaphorical symbols (the snake, the cellar, the ocean), repressed complexes, and emotional states that shift over time.
- The Developer (you and Antigravity): sees that same journal entry as a Data Object that needs to be stored securely, formatted so the AI can read it, and queried mathematically (Query) as fast as possible.

The JournalEntry table is precisely the "bridge" that connects these two viewpoints. It is where all of the user's raw notes are stored after passing through the security filter.

Below is the detailed structure of each field of this table to help you visualize it:

## 1. Detailed structure of a JournalEntry

In the database configuration file (schema.prisma), a journal row is defined with the following core attributes:

### Field 1: content_encrypted (Encrypted content)
- Nature: This is the text content of the user's journal entry or dream record.
- Why must it be encrypted? Because it complies with the Zero-Knowledge Architecture policy. Our system does not store plaintext. When the user finishes typing, the text is encrypted with the AES-256 algorithm right on their device (Client-side) before being sent to the DB. Only the user holds the key to decrypt and re-read their own writing.

### Field 2: entry_type (Classification of mental data)
- Nature: A String that classifies the input state. It usually consists of 3 main types:
- dream: Dream journal (Requires the AI to focus on extracting metaphorical symbols and Archetypes).
- reflection: Daytime reflection while awake (The AI focuses on analyzing the state of the Ego and its defense mechanisms).
- active_imagination: Active imagination (A stream of direct dialogue with the Shadow).

### Field 3: mood_vector (1536-dimensional space vector)
- Nature: This is the system's "killer" feature. This field stores neither text nor ordinary numbers, but an Array of Floats produced by an AI model (such as Gemini) after reading the journal entry.
- Its job: It digitizes the "vibe," the mood, and the semantics of the entry into a coordinate in mathematical space.

## 2. Why is the JournalEntry table extremely important to the system?

Without this table, your application would be nothing more than a static note-taking app. Thanks to the structure of JournalEntry, your system can do 2 things that are impossible for ordinary apps:

### Feature 1: Finding "The Red Thread" through Vector Similarity Search

Imagine the following scenario:
- Tonight, the user dreams that they are "chased by a man dressed in black down a narrow corridor." They record it.
- The system converts the audio file into text, creates a new JournalEntry, computes the mood_vector of this dream, and saves it to the DB.
- Instead of analyzing it in isolation, the Backend uses a pgvector command to scan back into the past: "Find me the 3 JournalEntry entries whose mood_vector is most similar to tonight's entry (using the Cosine Distance algorithm)."
- The system discovers: 6 months ago, the user once wrote a reflection about "being pressured by their boss in a small meeting room."
- Result: The AI immediately recognizes that the man in black in the narrow corridor is the projection of the Frustration with the boss figure (Power complex) in real life. The AI will pick up this context to ask the user deep, reflective questions.

### Feature 2: Feeding the "Constellation" Dashboard

The JournalEntry table has a One-to-Many relationship with the ArchetypalTag table (archetypal-pattern tags).

Once a JournalEntry is saved, it triggers the AI to scan through it and produce supplementary data rows — for example: this entry contains 70% Shadow attributes and 30% Anima attributes. From these tags attached to each JournalEntry row over time, libraries such as D3.js then have the data to draw a dynamic chart of the user's psychological evolution.

### In short, to make it easy to understand:
JournalEntry is the black box that securely stores each fragment of the user's psyche in encrypted form, while at the same time being the mathematical coordinate (vector) that lets the AI connect the individual fragments of the past into a systematic, mythic narrative.

Do you now clearly understand the role of the mood_vector field and how it links the user's points in time together? Press the "Export to Docs" button to save this analysis to your project folder on Drive!

## Related notes
- [[data-model-archetypaltag]]
- [[entry-naming-rationale]]
- [[jungian-analysis-domain]]
