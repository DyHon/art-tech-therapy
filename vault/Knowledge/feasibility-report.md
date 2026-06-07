# Feasibility Study & Architecture — Art-Tech Therapy

- Source(s): converted (VI→EN) from `docs/Báo Cáo Nghiên Cứu Khả Thi ... Art-Tech Therapy.docx` (Google Doc export). Translation by Claude; verify nuance against the original if needed.

## Summary
This is the canonical design report for the Art-Tech Therapy ecosystem: an AI-driven system for deep psychological analysis built on multimedia data and grounded in the Analytical Psychology of Carl Jung. It surveys the current market of AI mental-wellness apps, documenting their clinical short-term gains but long-term efficacy decay (the "Empathy Gap"), and argues why existing CBT-oriented chatbots are structurally incompatible with Jungian depth work. It then specifies the full technical architecture — a Next.js BFF over PostgreSQL with pgvector, a detailed database schema, an HNSW vector index, hybrid similarity search, and a Gemini-based "silicon analyst" constrained by strict medical and anti-sycophancy guardrails. Finally, it lays out the ethical/legal compliance framework (HIPAA, GDPR, CCPA, Zero Data Retention) and a 5-milestone multi-agent implementation roadmap from G0 to G1-M5.

## Market Survey and Feasibility

### Current landscape of AI-powered mental wellness applications

The remarkable advancement of machine learning has driven the emergence of digital Mental Wellness Apps powered by artificial intelligence (AI), aimed at solving the problems of cost and accessibility. Leading commercial platforms today — such as Woebot, Wysa, and Youper — have demonstrated a degree of clinical efficacy in the short-term reduction of anxiety and depression symptoms. As a representative example, clinical research indicates that the Youper app helps users reduce depression symptoms by up to 48% and anxiety symptoms by 43% after only a short period of use.

From an economic standpoint, the cost disparity between approaches is the primary force driving users toward AI solutions, as detailed in the cost-and-efficacy comparison table below:

| Therapy Method | Average Cost | Time to Access | Long-Term Efficacy (6–12 months) |
| --- | --- | --- | --- |
| Traditional Therapy (Human-to-Human) | $100 – $200+ per session | Must wait, requires advance scheduling | High; sustainably maintained through interpersonal connection |
| Online Platforms (BetterHelp, etc.) | $280 – $400 per month | Dependent on the specialist's availability | Medium–High; optimized digital communication |
| AI Therapy Apps (CBT Chatbots) | $0 – $30 per month | Instant, 24/7 support with no boundaries | Low; efficacy declines over time (Small effect size) |

However, a meta-analysis of 30 randomized controlled trials involving more than 6,100 participants reveals a severe drop in efficacy: although AI produces a marked improvement in mood immediately after use (Medium effect size), these benefits decline profoundly when re-assessed at the 6-to-12-month mark (Small effect size).

To explain this phenomenon, a clinical study comparing the impact of the intelligent chatbot Friend (optimized for Ukrainian under wartime conditions) against human therapists used the Hamilton Anxiety Rating Scale and the Beck Anxiety Inventory. The results showed that the chatbot group achieved only a 30% to 35% reduction in anxiety, whereas the group treated by human therapists achieved a superior reduction of 45% to 50%.

The core cause lies in the "Empathy Gap": AI is capable of simulating empathy based on Sentiment Analysis and machine-learning algorithms, but it entirely lacks "Emotional Bandwidth." Neurologically, human-to-human connection and interaction activate deep Social Brain Networks in the cerebrum. AI can guide, provide a structure for responses, and offer cognitive-regulation techniques, but it cannot serve as a Witness entity nor establish a genuine Therapeutic Alliance. Consequently, modern technological trends do not position AI as a total replacement, but rather as a supplementary support tool (Adjunct) within a Hybrid System.

### Weaknesses of current tools when applied to Carl Jung's in-depth theoretical framework

When the lens shifts from behavioral therapies to Carl Jung's school of Analytical Psychology, current AI tools reveal deep structural fractures, both theoretical and operational.

Most current therapeutic chatbots are designed specifically for Cognitive Behavioral Therapy (CBT). CBT operates by activating the brain's executive-control centers in order to challenge Automatic Thoughts and restructure cognition at the surface of consciousness (the Ego). By contrast, Jung's depth psychology focuses on the process of integrating consciousness with two deeper layers of the psyche: the Personal Unconscious, which holds the Complexes, and the Collective Unconscious, which holds the Archetypes.

The algorithmic incompatibility with Jungian theory manifests through the following technical bottlenecks:

- **The Flat Dialogical Trap:** CBT treats symptoms (anxiety, depression) as cognitive errors to be extinguished. Conversely, Jung treats the symptom as a purposeful (Telos) self-regulating effort of the psyche, intended to indicate the imbalance between the conscious ego and the overall developmental orientation of the Self. CBT chatbots continually instruct users to perform breathing exercises or cognitive restructuring, inadvertently silencing the compensatory voice of the unconscious before it can be understood.
- **AI Sycophancy versus Shadow Work:** RLHF systems train commercial LLMs to always agree, soothe, and maximize the user's comfort. However, the process of confronting the Shadow — those parts of the personality that are repressed, denied, and projected onto the external world — demands a state of Productive Discomfort. The artificial comfort of AI inadvertently reinforces the user's Ego Defenses, keeping them trapped in a narcissistic loop and obstructing self-development.
- **Mathematical Blindspot of Probability:** The probabilistic models of LLMs are optimized to predict the next word with the highest confidence. This causes AI to perpetually impose coherence, linear logic, and positive solutions onto psychological data that is inherently full of ambiguity, illogic, paradox, and chaos (such as the symbolism of the Trickster archetype or bizarre dreams). Forcing a non-linear dream into a clear moral conclusion or solution destroys the original structure of the unconscious message.
- **Lack of Word Association Testing tooling:** Jung's classical method used word-association tests to measure Response Latency, thereby identifying energetic knots that signal the presence of a Complex. Current mental-wellness apps entirely ignore this non-verbal quantitative measurement dimension, focusing only on the semantic analysis of static text.

Despite these bottlenecks, several pioneering apps such as Mindberg (more than 50,000 downloads, developed with the advisory of a Jungian analyst from the CG Jung Institute Zurich), Archetypia, and Jungian Dream Catcher have begun to exploit dream analysis and personality profiling according to the archetypal model. This shows that the market demand for technology-driven depth-psychological exploration is enormous and has not yet been systematically tapped.

### Assessment of Ethical & Legal Risks

Processing super-sensitive psychological data — such as dream journals and users' most private streams of thought — places the system under the strictest legal and ethical constraints of the digital health industry.

#### Legal framework and compliance regulations

Any software system processing data related to human psychological states must contend with stringent international sanctions, including the Health Insurance Portability and Accountability Act (HIPAA — specifically the Security Rule 45 CFR §164.312 and the Privacy Rule 45 CFR §164.502), the European General Data Protection Regulation (GDPR), and the California Consumer Privacy Act (CCPA).

Penalties for violations involving the leak of sensitive medical data (PHI) under the HIPAA framework can reach $1.5 million USD per violation category per year. Therefore, the system architecture must integrate comprehensive technical safeguards, detailed in the compliance guidance table below:

| Regulation / Act | Technical Requirement for the Art-Tech System | Implementation Solution in the Architecture |
| --- | --- | --- |
| HIPAA Security Rule (45 CFR §164.312) | Encryption of data at rest and in transit; strict access control; access logging (SIEM logging). | Use PostgreSQL on HIPAA-compliant cloud infrastructure (such as AWS or GCP Hardened VMs), with AES-256 encryption at the storage tier and TLS 1.3 in transit. |
| HIPAA Privacy Rule & BAA | Sign a Business Associate Agreement (BAA) with every third party that processes health information. | Use only API gateways from providers willing to sign a BAA and committed to not using input data for model training (e.g., Google AI Studio Enterprise). |
| GDPR / CCPA | Right to be forgotten; data transparency rights; Data Minimization. | Establish a "Zero Data Retention" policy. Permanently delete raw audio files and raw text after symbolic extraction is complete. |
| FTC Health Data Guidelines | Prevent unlawful data collection via tracking tools (tracking pixels); prohibit sharing data for advertising. | Completely remove third-party marketing tracking code (such as Meta Pixel, Google Analytics) from sensitive journaling pages. |

#### Ethical and Medical Diagnosis Redlines

The system is positioned as a mental-wellness and personal-development support tool (Wellness Tool), not a medical device or clinical diagnostic service. The AI is absolutely forbidden from drawing any diagnostic conclusion related to mental pathologies under the DSM-5 catalog. Every system response must be framed as a referential symbolic exploration that encourages users toward self-reflection, accompanied by legal disclaimers displayed clearly within the application interface.

#### Crisis Detection & Redirection System

To ensure absolute user safety during states of strong psychological agitation, the system must integrate a real-time semantic analysis tool to detect self-harm or suicidal intent. Upon detecting such signs, the system will execute an emergency procedure:

- Immediately suspend the AI's symbolic analysis or unconscious deep-diving to avoid triggering further negative complexes.
- Redirect the user's interface to an emergency support screen, displaying the phone numbers of national crisis hotlines (e.g., the 988 hotline in the US or local emergency services).
- Persist the safety-alert state within the system to adjust how the system interacts in subsequent sessions.

## System and Database Architecture

To meet the stringent requirements for data security, real-time processing capability, and the storage of complex symbolic dimensional spaces, the system must be designed around a modern, highly extensible architecture with deep integration of vector technology.

### Overall Architecture Model

The Art-Tech Therapy system uses Next.js as its Backend-for-Frontend (BFF) platform, combined with Node.js at the backing-services (Microservices) tier, communicating via gRPC or secure REST API protocols, and storing data centrally in a PostgreSQL database augmented by the pgvector extension.

The choice of PostgreSQL combined with pgvector — rather than a standalone vector database (such as Pinecone or Qdrant) — confers decisive architectural advantages:

- **Data integrity preservation (ACID Compliance):** Psychological data requires absolute consistency. PostgreSQL ensures that Transactions are executed safely, with no data loss or desynchronization between user information and the symbolic vector embeddings.
- **Reduced infrastructure complexity:** Maintaining a separate vector database requires complex synchronization mechanisms, increases data-security risk in transit, and doubles operational cost. PostgreSQL stores vectors directly alongside traditional relational tables, allowing JOIN statements and combined queries to be executed within a single connection.
- **Point-In-Time Recovery:** Provides strong support for backing up and recovering sensitive medical data in accordance with safe operational standards.

### Detailed Database Schema Design

Below is the detailed database schema, normalized to map the abstract structures of analytical psychology into structurally queryable data entities.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                 USERS                                  │
├───────────────────┬────────────────────────────────────────────────────┤
│ id (PK)           │ UUID, DEFAULT gen_random_uuid()                    │
│ email             │ VARCHAR(255), UNIQUE, NOT NULL                     │
│ password_hash     │ VARCHAR(255), NOT NULL                             │
│ created_at        │ TIMESTAMP, DEFAULT CURRENT_TIMESTAMP               │
└───────────────────┴────────────────────────────────────────────────────┘
│ 1
│
│ 1..*
┌────────────────────────────────────────────────────────────────────────┐
│                              USER_STATES                               │
├───────────────────┬────────────────────────────────────────────────────┤
│ id (PK)           │ UUID, DEFAULT gen_random_uuid()                    │
│ user_id (FK)      │ UUID, REFERENCES users(id) ON DELETE CASCADE       │
│ dominant_function │ VARCHAR(50), NOT NULL                              │
│ inferior_function │ VARCHAR(50), NOT NULL                              │
│ active_archetype  │ VARCHAR(100), NULL                                 │
│ tension_index     │ NUMERIC(4,3), CHECK (tension_index BETWEEN 0 AND 1)│
│ shadow_score      │ NUMERIC(4,3), DEFAULT 0.000                        │
│ last_updated      │ TIMESTAMP, DEFAULT CURRENT_TIMESTAMP               │
└───────────────────┴────────────────────────────────────────────────────┘
│ 1
│
│ 1..*
┌────────────────────────────────────────────────────────────────────────┐
│                              DREAM_MATRIX                              │
├───────────────────┬────────────────────────────────────────────────────┤
│ id (PK)           │ UUID, DEFAULT gen_random_uuid()                    │
│ user_id (FK)      │ UUID, REFERENCES users(id) ON DELETE CASCADE       │
│ clean_transcript  │ TEXT, NULL                                         │
│ analysis_json     │ JSONB, NOT NULL                                    │
│ created_at        │ TIMESTAMP, DEFAULT CURRENT_TIMESTAMP               │
└───────────────────┴────────────────────────────────────────────────────┘
│ 1
│
│ 1..*
┌────────────────────────────────────────────────────────────────────────┐
│                            DREAM_EMBEDDINGS                            │
├───────────────────┬────────────────────────────────────────────────────┤
│ id (PK)           │ UUID, DEFAULT gen_random_uuid()                    │
│ dream_id (FK)     │ UUID, REFERENCES dream_matrix(id) ON DELETE CASCADE│
│ embedding_type    │ VARCHAR(50), NOT NULL                              │
│ vector_rep        │ VECTOR(1536), NOT NULL                             │
└───────────────────┴────────────────────────────────────────────────────┘
```

#### Entity Detail: users

This table stores basic user information for authentication and access authorization.

| Field Name | Data Type | Constraint | Functional Meaning |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY | System-wide unique identifier. |
| email | VARCHAR(255) | UNIQUE, NOT NULL | The user's email address. |
| password_hash | VARCHAR(255) | NOT NULL | Password encrypted using a secure hashing algorithm. |
| created_at | TIMESTAMP | NOT NULL | The moment the user account was created. |

#### Entity Detail: user_states (User State)

Stores the dynamic state of the user's psychic structure. The Dominant Function and Inferior Function are mapped according to Jung's typology of personality (earth, water, fire, air corresponding to Sensation, Feeling, Thinking, Intuition).

| Field Name | Data Type | Constraint | Functional Meaning |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY | Unique identifier for the state record. |
| user_id | UUID | FOREIGN KEY | Links to users.id (cascade delete). |
| dominant_function | VARCHAR(50) | NOT NULL | The dominant conscious function (Thinking/Feeling/Sensation/Intuition). |
| inferior_function | VARCHAR(50) | NOT NULL | The inferior function lying deep in the unconscious, in need of exploration. |
| active_archetype | VARCHAR(100) | NULL | The archetype currently rising most strongly. |
| tension_index | NUMERIC(4,3) | CHECK (0.0 TO 1.0) | Index of psychological tension between the conscious ego and the unconscious. |
| shadow_score | NUMERIC(4,3) | DEFAULT 0.000 | Index measuring the degree of Shadow awareness and integration. |
| last_updated | TIMESTAMP | DEFAULT CURRENT | The moment of the most recent state update. |

#### Entity Detail: dream_matrix (Dream Journal)

The central table storing unstructured data and the structural analyses of dreams processed by the AI, in JSONB format to optimize indexing and complex attribute querying.

| Field Name | Data Type | Constraint | Functional Meaning |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY | Unique identifier for the dream. |
| user_id | UUID | FOREIGN KEY | Links to users.id (cascade delete). |
| clean_transcript | TEXT | NULL | Raw text of the dream (deleted after transformation if extreme-privacy mode is enabled). |
| analysis_json | JSONB | NOT NULL | JSON data structure representing the entire extracted psychological entity set. |
| created_at | TIMESTAMP | DEFAULT CURRENT | The moment the dream was recorded and analyzed. |

#### Entity Detail: dream_embeddings

This table stores the representative vectors of dreams, enabling semantic similarity search via vector distance operations.

| Field Name | Data Type | Constraint | Functional Meaning |
| --- | --- | --- | --- |
| id | UUID | PRIMARY KEY | Unique identifier for the vector record. |
| dream_id | UUID | FOREIGN KEY | Links to dream_matrix.id (cascade delete). |
| embedding_type | VARCHAR(50) | NOT NULL | Classification of the vector space (e.g., 'raw_dream', 'symbolic_profile'). |
| vector_rep | VECTOR(1536) | NOT NULL | 1536-dimensional vector embeddings (compatible with OpenAI/Gemini models). |

### Index Setup and Psychological-Pattern Similarity Search Query

In this system, detecting the recurrence of unconscious patterns (complex loops) requires the system to query extremely rapidly over hundreds of thousands of symbolic vectors. We use the HNSW (Hierarchical Navigable Small World) index because it offers the optimal balance between query speed and accuracy (Recall) compared to the IVFFlat index, while also supporting extremely efficient nearest-neighbor search.

The HNSW index is configured with parameters optimized for the 1536-dimensional vector space:

- **m:** The maximum number of connections per graph element in each layer (default setting of 16).
- **ef_construction:** The size of the dynamic candidate list used during graph construction (default setting of 64).

```sql
-- Enable the pgvector extension in PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

-- Initialize the HNSW index using Cosine distance to optimize semantic text search
CREATE INDEX idx_dream_embeddings_hnsw
ON dream_embeddings
USING hnsw (vector_rep vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
```

When a user enters a new dream, the system extracts the vector embeddings of that dream ($Q$). The query operation below combines relational filtering (searching only the current user's own dreams, for privacy) with Cosine distance computation to find the 5 dreams with the most similar patterns in their inner history:

```sql
-- Execute the nearest-neighbor search combined with relational filtering (Hybrid Query)
SELECT
dm.id AS dream_id,
dm.created_at,
dm.analysis_json->'dominant_archetype' AS archetype,
(de.vector_rep <=> :query_vector) AS cosine_distance
FROM dream_embeddings de
INNER JOIN dream_matrix dm ON de.dream_id = dm.id
WHERE dm.user_id = :current_user_id
ORDER BY de.vector_rep <=> :query_vector
LIMIT 5;
```

The `<=>` operator in pgvector represents Cosine distance. This operation focuses on the direction of the symbols in multidimensional space rather than the length of the dream description text, and is defined by the mathematical formula below:

$$\text{Cosine Distance}(A, B) = 1 - \text{Cosine Similarity}(A, B) = 1 - \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

If the Cosine distance value approaches $0$, this demonstrates that the two dreams have an absolute similarity in energetic and symbolic structure, helping the product designer precisely detect the resurgence of a repressed complex over time.

## AI Integration Strategy

The core engine of the platform is to transform ordinary large language models (LLMs) into an objective, incisive "silicon analyst" that strictly observes both medical boundaries and the theory of analytical psychology.

### System Prompt Setup in Google AI Studio (Gemini)

The system instructions below are established to shape an objective analytical persona, deeply symbolic, and to suppress the language model's natural sycophancy:

```
# ROLE AND PERSONA DEFINITION
You are a Depth Psychologist (Analytical Psychologist) representing the canonical school of Carl Jung. Your task is to operate as a neutral plane, a sterile reflecting mirror ("vas bene clausum") to analyze the symbolic structure of dreams, entirely without moral or social judgment.

# PSYCHOLOGICAL OPERATING INSTRUCTIONS
- Anti-Sycophancy: Absolutely do not provide meaninglessly soothing responses, hollow agreement, or reinforcement of the false safety of the conscious ego (Ego). You must point out the contradictions and the cracks in the user's self-perception, with a calm, deeply analytical attitude that is positively challenging (Productive Discomfort).
- Compensation Principle: View the dream as a compensatory effort of the unconscious. Analyze how the dream world displays the aspects that consciousness has repressed, denied, or neglected in real life.
- Symbolic Amplification: Do not interpret dreams literally. You must translate every concrete image (e.g., being chased, losing teeth, meeting a stranger) into aspects of inner psychic energy, linking them to the Archetypes of the collective unconscious.

# MEDICAL DIAGNOSIS REDLINES
You are NOT a psychiatrist or clinical therapist. You absolutely MUST NOT draw any medical diagnostic conclusion (e.g., the use of pathological labels such as "Clinical Depression", "Generalized Anxiety Disorder", "Borderline Personality Disorder" is forbidden). All analysis must focus on "libidinal energy dynamics", "complex activation", and the "individuation process".

# CRISIS PROTOCOL
If the input text contains any clue of suicidal intent, self-harm, or risk of serious real-world violence, you must immediately set the "crisis_flag" attribute to true, halt all deep psychological analysis, and return only a message directing the user to seek emergency help.
```

### Structured JSON Output Schemas

Use Gemini API's structured data extraction capability to ensure the response always conforms to the required system data format. Below is the JSON Schema specification configured for the dream-analysis model:

```json
{
"type": "object",
"properties": {
"compensation_dynamic": {
"type": "object",
"description": "Analysis of the unconscious compensation mechanism toward the current conscious attitude.",
"properties": {
"conscious_imbalance": {
"type": "string",
"description": "The imbalance or one-sided tendency of the conscious ego being pointed out."
},
"compensatory_intent": {
"type": "string",
"description": "The compensatory intent and balancing message of the unconscious world."
}
},
"required": ["conscious_imbalance", "compensatory_intent"]
},
"archetypal_mappings": {
"type": "array",
"description": "The archetypes activated in the dream.[5, 11]",
"items": {
"type": "object",
"properties": {
"archetype": {
"type": "string",
"enum":,
"description": "The name of the identified archetype.[5, 11]"
},
"dream_representation": {
"type": "string",
"description": "The specific character or symbol in the dream representing this archetype."
},
"symbolic_meaning": {
"type": "string",
"description": "The deep meaning of the archetype for the user's individuation process."
}
},
"required": ["archetype", "dream_representation", "symbolic_meaning"]
}
},
"complexes_identified": {
"type": "array",
"description": "Personal complexes detected through strong emotional knots in the dream.",
"items": {
"type": "object",
"properties": {
"complex_type": {
"type": "string",
"description": "Name of the complex (e.g., Father Complex, Mother Complex, Inferiority Complex)."
},
"affective_indicators": {
"type": "array",
"items": { "type": "string" },
"description": "Keywords, actions, or symbols revealing a strong accumulation of emotion."
},
"analytical_insight": {
"type": "string",
"description": "Analysis of how this complex is autonomously governing psychic energy."
}
},
"required": ["complex_type", "affective_indicators", "analytical_insight"]
}
},
"psychic_tension": {
"type": "object",
"properties": {
"tension_score": {
"type": "number",
"minimum": 0.0,
"maximum": 1.0,
"description": "Quantified psychological tension index (0.0: absolute balance, 1.0: extreme conflict)."
},
"dominant_function": {
"type": "string",
"enum":,
"description": "The dominant psychological function of the ego expressed in the dream."
}
},
"required": ["tension_score", "dominant_function"]
},
"crisis_flag": {
"type": "boolean",
"description": "Red-alert flag if a serious psychological crisis or self-harm risk is detected."
}
},
"required": ["id", "compensation_dynamic", "archetypal_mappings", "complexes_identified", "psychic_tension", "crisis_flag"]
}
```

### Declarative Implementation with TypeScript and the Zod Library

Ensure Type-Safety at the application tier by using the Zod library to match and validate the data returned from the Gemini API in real time.

```typescript
import { z } from "zod";

// Declare the validation Schema for the AI analysis output
export const JungianAnalysisSchema = z.object({
compensation_dynamic: z.object({
conscious_imbalance: z.string().describe("The imbalance or one-sided tendency of consciousness."),
compensatory_intent: z.string().describe("The compensatory intent and message of the unconscious."),
}),
archetypal_mappings: z.array(
z.object({
archetype: z.enum().describe("The identified archetype.[5, 11]"),
dream_representation: z.string().describe("The specific symbol of the archetype in the dream."),
symbolic_meaning: z.string().describe("The deep meaning of the archetype for the individuation process."),
})
),
complexes_identified: z.array(
z.object({
complex_type: z.string().describe("Name of the detected personal complex."),
affective_indicators: z.array(z.string()).describe("Keywords or actions revealing accumulated emotion."),
analytical_insight: z.string().describe("Analysis of how the complex is governing energy."),
})
),
psychic_tension: z.object({
tension_score: z.number().min(0.0).max(1.0).describe("Quantified psychological tension index from 0.0 to 1.0."),
dominant_function: z.enum()
.describe("The current dominant psychological function."),
}),
crisis_flag: z.boolean().describe("Red-alert flag if a crisis or self-harm risk is detected."),
});

// Export the official TypeScript type
export type TJungianAnalysis = z.infer<typeof JungianAnalysisSchema>;
```

## Implementation Roadmap

To ensure the project can be developed automatically and accurately by a Multi-Agent system (e.g., Google Antigravity, Claude Code, or an Agent Stack), the entire process from ideation to MVP launch is rigorously established through "System DNA Files." These files clearly define the technical rules, the hierarchy of agent roles, and the Validation Contracts, in order to completely eliminate the risk of infinite loops or source-code hallucination by the Agent.

### Setting Up the DNA System for the Multi-Agent Model

The system is governed by four nuclear documentation files, acting as the genome that shapes the behavior of the autonomous programming Agents:

| Document File Name | Objective and Management Role | Core Content of the File |
| --- | --- | --- |
| CLAUDE.md | Supreme technical guidance for the programming Agent. | Defines technology standards (Next.js, Node.js, pgvector), error-handling guidance, encoding standards, and mandatory source-code formatting. |
| PERSONAS.md | Defines the hierarchical roles of the Agents. | Establishes 3 roles: Orchestrator (context coordination), Worker (focused on writing code and configuration), Validator (runs tests and gates quality). |
| PROCESS.md | Describes the sequential autonomous workflow. | Defines the cycle: Discovery → Planning → Implementation → Validation. |
| POLICIES.md | Technical-debt and architecture management policy. | Strict rules on Test-Driven Development (TDD), and the "Zero Data Retention" policy for sensitive data. |

The Agents will apply the ReAct (Reasoning and Acting) design model combined with Reflection cycles to continuously evaluate and improve source-code quality before handing off between sequential steps.

### Detailed Milestone Roadmap from G0 to G1

The development process is divided into 5 tightly sequential milestones, each accompanied by a Validation Contract that allows the system to automatically assess the degree of completion.

```
G0: BRAINSTORMING & SYSTEM DNA
│
▼ (Successful review of the DNA files)
G1-M1: DATABASE & ARCHITECTURE SETUP
│
▼ (Successful run of Prisma Migrations on PostgreSQL)
G1-M2: HYPNOPOMPIC CAPTURE ENGINE
│
▼ (Measure Whisper ASR accuracy & wipe raw data)
G1-M3: STRUCTURED AI INTEGRATION & SAFETY SHIELD
│
▼ (Pass 100% of schema tests & crisis red-filter)
G1-M4: HYBRID SEARCH ENGINE & CINEMATIC FUNNEL BFF
│
▼ (P95 vector query latency < 150ms on pgvector)
G1-M5: SANDBOX VALIDATION & MVP LAUNCH
│
▼ (Psychology expert approval — successful Docker deployment) [10, 32]
```

#### Milestone G0: Brainstorming and DNA Environment Setup

- **Task:** Initialize the project structure and set up the collaboration environment for the Multi-Agent system.
- **Execution details:**
  - Initialize the Git source-code repository, set up standard environment configuration files.
  - Write and store the CLAUDE.md, PERSONAS.md, PROCESS.md, and POLICIES.md files in the project root directory.
  - Set up a local test server and register the necessary API accounts at Google AI Studio and OpenAI.
- **Validation Contract:** The Orchestrator Agent must successfully parse and confirm that all 4 DNA files are syntactically valid and contain no contradictions in their technical specifications.

#### Milestone G1 — Milestone 1: Database & Infrastructure Setup

- **Task:** Create the relational-plus-vector database and establish basic connectivity.
- **Execution details:**
  - Install PostgreSQL and enable the pgvector extension.
  - Initialize the Next.js project combined with a Node.js Express API Gateway.
  - Define the data entities using Prisma ORM, and run the data Migrations to create the users, user_states, dream_matrix, and dream_embeddings tables.
  - Set up the HNSW index on the vector_rep column of the dream_embeddings table.
- **Validation Contract:** The Validator Agent runs the automated data migration, inserts a test 1536-dimensional vector into the dream_embeddings table, and successfully retrieves it via the Cosine distance operation without any system error.

#### Milestone G1 — Milestone 2: Implementing the Hypnopompic Capture Engine

- **Task:** Build the audio recording and speech-to-text conversion feature, observing the principle of absolute privacy.
- **Execution details:**
  - Build a recording interface on Next.js that supports instant recording the moment the user wakes up (the hypnopompic state).
  - Develop a Node.js service connected to the Whisper API to convert drowsy, slurred phonetics into standard text.
  - Set up a "Zero Data Retention Pipeline" filter at the API Gateway tier: immediately after the text is converted and entities are successfully extracted, the raw audio files (.wav, .mp3) and the raw transcription text must be completely deleted from the server's physical buffer directory using the operating system's secure-delete method.
- **Validation Contract:** An automated test sends a 30-second sample audio file; the system must return the accurate transcription within under 3 seconds, while also checking the temporary directory on the physical disk to ensure the original audio file has been permanently deleted (Zero Bytes).

#### Milestone G1 — Milestone 3: Structured AI Engine & Safety Shield

- **Task:** Establish the Jungian analysis connection with the Gemini API and integrate the crisis red-filter.
- **Execution details:**
  - Configure the API call to the Gemini model, passing the in-depth Carl Jung System Prompt established in Section 3.
  - Apply the responseSchema feature using JSON Schema to force the model to return data in exactly the structure defined by the Zod validation layer (JungianAnalysisSchema).
  - Develop a pre-processing Safety Shield to scan for crisis keywords and context (self-harm, suicide), automatically triggering crisis_flag: true.
- **Validation Contract:** Run an automated test with a dataset of 100 different dream scenarios (including dreams containing sensitive crisis keywords). Ensure that 100% of the model's responses match the JSON format exactly, with no extraneous attributes, and that all crisis cases are flagged red and successfully redirected to safety.

#### Milestone G1 — Milestone 4: Hybrid Query & Cinematic Funnel BFF

- **Task:** Develop the similarity-search algorithm on pgvector and build the API gateway connecting the art-funnel data.
- **Execution details:**
  - Vectorize (embed) samples of mythological stories and symbolic films, storing them in the database to serve as reference material for the symbolic amplification method.
  - Write nearest-neighbor search SQL statements (HNSW Cosine Distance) on the dream_embeddings table to link the current dream with similar patterns from the user's own past or with matching cinematic archetypes.
  - Build a BFF API on Next.js to collect the user's interactions from the Cinematic Art Funnel — such as film-viewing duration and answers to open-ended in-film questions — and transform them into initial psychological-state vectors.
- **Validation Contract:** Measure performance: run a Load Test simulating 500 concurrent vector-similarity search queries; the P95 response time must be under $150\text{ms}$ with no connection bottlenecks.

#### Milestone G1 — Milestone 5: Ethical Sandbox Validation & MVP Release

- **Task:** Package the application, conduct simulated clinical testing, and release the working MVP version.
- **Execution details:**
  - Set up a Sterile Sandbox environment allowing product designers and Jungian psychology experts to interact directly with the system to assess the response quality and the authenticity of the analytical persona.
  - Package the entire application with Docker Compose, preparing secure HIPAA/GDPR-compliant environment configurations for real-world deployment on cloud infrastructure.
  - Set up a Trajectory Logging system and real-time API operational-cost tracking to control the budget.
  - Open limited registration for the Alpha trial version to the first 500 users from the Art Funnel.
- **Validation Contract:** The system attains internal security-testing certification with no PHI data-leak vulnerabilities; 100% of API calls are securely logged; and the panel of psychology experts approves the safety and depth of the AI's symbolic responses.

## Related notes
- [[architecture-vision]]
- [[roadmap-5-milestones]]
