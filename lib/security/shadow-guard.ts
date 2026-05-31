/**
 * ShadowGuard Middleware - Crisis Sentiment & Psychosis Interception
 * Establishes ethical redlines before LLM/Jungian processing.
 */
export interface IShadowGuardResult {
  crisis_flag: boolean;
  reason?: string;
}

const CRISIS_KEYWORDS = [
  "tự tử", "suicide", "tự sát", "muốn chết", "kill myself", "end my life",
  "cắt cổ tay", "uống thuốc ngủ", "self-harm", "tự làm hại",
  "nghe thấy giọng nói trong đầu", "ảo giác", "hallucination", "psychosis",
  "giết người", "mưu sát", "harm others", "bạo lực"
];

export function checkCrisis(text: string): IShadowGuardResult {
  const normalized = text.toLowerCase();
  
  for (const keyword of CRISIS_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        crisis_flag: true,
        reason: `Crisis sentiment detected on matched term: "${keyword}"`
      };
    }
  }

  return {
    crisis_flag: false
  };
}
