# Data Model — ArchetypalTag

- Source(s): converted (VI→EN) from `docs/what is it_/ArchetypalTag.docx` (Google Doc export).

## Summary
If JournalEntry stores the outer shell of a user's writing (their words and dream narratives), the ArchetypalTag table stores the inner soul — the core psychological structures the AI extracts after stripping away the language layer. Each tag captures a Jungian archetype, its intensity, its symbolic motifs, and whether it has been integrated, providing the structured indicators that let the Frontend draw the user's psychological map over time.

## Breaking down the ArchetypalTag table

To continue building the storage brain for the project, you and I will break down the ArchetypalTag table (Archetypal Pattern Tag) together.

If the JournalEntry table (or Inscape, as we just discussed) acts as the place that stores the outer shell (the user's words and dream narratives), then ArchetypalTag is the place that stores the inner soul — that is, the core psychological structures the AI extracts after stripping away that language shell.

From the perspective of both engineering and depth psychology, here is why this table exists and its detailed structure:

## 1. Why not merge it into the Journal table — why keep it separate?

As a Web Developer, you will immediately see the system-design thinking here. A journal entry (JournalEntry) can be very long and contain many different layers of meaning. Within the same dream, the user might both confront a fear (Shadow) and meet a guide (the Wise Old Man).

Therefore, the relationship here is One-to-Many: one journal entry will give rise to many archetypal tags (ArchetypalTag). Keeping them separate makes it easy for you to query, filter data, and draw dynamic charts on the Frontend.

## 2. Detailed structure of each field of ArchetypalTag

In the database configuration file, each ArchetypalTag carries the following "valuable" attributes:

### Field 1: archetype_name (Archetype/Complex name)
- Nature: A String that stores the name of the psychological structure according to Carl Jung's research framework.
- Core values: Shadow, Anima (the female self within the male), Animus (the male self within the female), Persona (the social mask), Trickster, or Great Mother.

### Field 2: intensity_score (Intensity scale)
- Nature: An Integer from 1 to 10 scored by Gemini after analyzing the entry.
- Technical meaning: This field measures how much "psychological energy" (Libido, in Jung's terms) is being poured into that archetype. The higher the score, the more strongly that complex is dominating the user's mind at the time of writing the journal.

### Field 3: symbolic_motifs (Array of metaphorical symbols)
- Nature: An array of strings (TEXT[] or String[]), for example: ['snake', 'basement', 'rusty key'].
- Job: This is where the specific "objects" or "images" that appear in the entry — which the AI identifies as embodiments of that archetype — are recorded. It helps the system build a personal Symbol Dictionary (user_symbols) for each individual.

### Field 4: is_integrated (Integration confirmation flag)
- Nature: A True/False Boolean, defaulting to FALSE.
- Supreme feature: This is the core data field for tracking the Individuation Process over time. When the user first confronts a wound or a part of the Shadow, this field is FALSE. Over a long period of therapy, if the AI or a psychology expert recognizes that the user has accepted, understood, and made peace with that dark part, this flag is switched to TRUE.

## 3. How the system operates ArchetypalTag in practice

Look at the Data Flow to see the power of this table when combined with the AI:
- The user writes: "I dreamed that I got lost in a dark, dense forest, and then a giant snake lunged out and wrapped tightly around my leg, making me suffocate."
- The AI extracts (AI Studio Output): Gemini reads the text and recognizes "the dark forest" and "the giant snake" as expressions of repressed drives belonging to the Shadow. The user's level of panic is scored 8/10.
- Writing to the DB: Antigravity orders the Backend to create an ArchetypalTag attached to that journal entry:
- archetype_name: "Shadow"
- intensity_score: 8
- symbolic_motifs: ['dark forest', 'giant snake']
- is_integrated: FALSE

## 4. What will the Frontend do with this pile of data?

Thanks to the ArchetypalTag table containing the scores and the clean is_integrated field, your Constellation Dashboard (The Constellation) becomes extremely vivid:
- You can use a charting library to draw a Radar Chart displaying the user's 4 psychic corners.
- You can draw a Line Chart along the time axis showing the rise and fall of the Shadow's intensity_score. The user will visually see: "Ah, it turns out that over the past 3 months, the energy of my Shadow has been gradually decreasing, meaning I am regaining my calm."

### In short, to make it easy to remember:
If JournalEntry is the content of the story, then ArchetypalTag is the psychological encoder that turns that story into scientific indicators, forming the foundation for the system to draw the user's mental map.

Please continue to press the "Export to Docs" button to store this definition of ArchetypalTag in the docs folder on the project Drive. Next, would you like me to go on and explain the equally important time-series table, UserSnapshot?

## Related notes
- [[data-model-journalentry]]
- [[jungian-analysis-domain]]
