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
}
