import { TJungianAnalysis } from "../validations/analysis";

/**
 * Interface representing a pluggable AI Engine Adapter for the Jungian Ledger.
 * Decouples the API routes and backend middleware from vendor-specific LLM implementations.
 */
export interface IAIEngineAdapter {
  /**
   * Translates cleartext/transcribed psychological entries into a schema-valid Jungian analysis ledger.
   */
  analyze(text: string): Promise<TJungianAnalysis>;

  /**
   * Vectorizes an entry into a fixed-length embedding (a numeric "meaning fingerprint")
   * used for similarity search — "The Red Thread". This does NOT interpret the text; it
   * only produces coordinates for cosine-distance math. Length must equal EMBEDDING_DIM.
   */
  embed(text: string): Promise<number[]>;
}
