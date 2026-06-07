# Why HNSW Index (vector search rationale)

- Source(s): converted (VI→EN) from `docs/HNSW index dùng để làm gì_.docx` (Google Doc export).

## Summary
HNSW (Hierarchical Navigable Small World) is a specialized index data-structure algorithm used to solve the Approximate Nearest Neighbor (ANN) search problem over high-dimensional vector space. In the Art-Tech Therapy hybrid AI architecture, it enables near-real-time semantic search across 1536-dim vectors produced by Gemini Embedding, surfacing hidden Jungian psychological connections without crashing the system.

In the hybrid AI system (Hybrid AI System) we are building for the Art-Tech Therapy project, HNSW (Hierarchical Navigable Small World) is a specialized type of index data-structure algorithm, used to solve the Approximate Nearest Neighbor (ANN) search problem over high-dimensional vector space.

To picture it technically: whereas an ordinary B-Tree index in PostgreSQL helps you quickly search text or numeric data (O(log N)) by comparing greater-than/less-than, the HNSW Index exists to search 1536-dimensional Vector data (produced by the Gemini Embedding model) at near-real-time speed.

Below are the use cases and the reasons why our system is required to use HNSW:

## 1. Searching for similarity in "Meaning" (Semantic Search)
HNSW does not search by exact keyword. It is used to find data points whose geometric distance is closest in vector space (using the Cosine Similarity operation).

- Application in the project: When a user records a new dream, Gemini transforms that dream into a vector coordinate. The HNSW index lets the system instantly scan the database to find past journals or dreams with the most similar metaphorical content, emotions, or symbols, thereby uncovering "The Red Thread" running throughout the user's psyche.

## 2. Solving the "Curse of Dimensionality" problem
When working with vectors of up to 1536 dimensions, mathematically computing the distance between a new vector and all of the millions of old vectors in the database (Full Table Scan / Exact KNN) would consume an extremely terrifying amount of CPU, choking the system (breaking the pipeline).

- How HNSW solves it: This algorithm builds a multi-layer graph structure (similar to a small-world network model — a Skip List combined with a Graph).
- The top layer consists of sparse links that let the AI "take long jumps" to quickly locate the region of space containing similar data.
- The further down the layers you go, the denser the links become, letting the AI "take short steps" to precisely find neighboring vectors.

## 3. Protecting the performance target (P95 Latency < 150ms)
As required by the strict rule set that the role of THE GUARDIAN demands in your system: the query speed for searching recurring symbols must not exceed 150ms.

- Without HNSW, as the database grows in real time, search speed would be directly proportional to the number of rows (O(N)) and would quickly bring the system down.
- With the HNSW Index (idx_journal_entry_vector_hnsw), the graph structure brings query speed to the O(log N) level. Even if a user stores tens of thousands of dreams over many years, the system still returns symbol-analysis results in just a few milliseconds.

In summary: the HNSW index is the "positioning map" that lets the AI system swim through your ocean of 1536-dimensional vector data, finding hidden Jungian psychological connections in the fastest way without burning out the graphics card or freezing the server.

## Related notes
- [[pgvector-hnsw]]
- [[roadmap-5-milestones]]
