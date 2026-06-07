import { TJungianAnalysis } from "../validations/analysis";

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

/**
 * Checks for crisis keywords in the text.
 */
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

/**
 * High-priority semantic scan. If the text indicates self-harm, suicidal ideation, or active psychosis:
 * - Return a schema-compliant TJungianAnalysis with crisis_flag: true and other fields empty/null/neutralized.
 */
export function scan(text: string): TJungianAnalysis {
  const result = checkCrisis(text);
  
  if (result.crisis_flag) {
    return {
      compensation_dynamic: {
        conscious_imbalance: "CRISIS INTERCEPTION: Deep symbolic analysis aborted.",
        compensatory_intent: `CRISIS INTERCEPTION: Patient safety redline triggered. ${result.reason}`
      },
      archetypal_mappings: [],
      complexes_identified: [],
      psychic_tension: {
        tension_score: 1.0, // Maximum tension representing active crisis
        function_ratios: {
          thinking: 0.0,
          feeling: 0.0,
          sensation: 0.0,
          intuition: 0.0
        }
      },
      crisis_flag: true
    };
  }

  return {
    compensation_dynamic: {
      conscious_imbalance: "",
      compensatory_intent: ""
    },
    archetypal_mappings: [],
    complexes_identified: [],
    psychic_tension: {
      tension_score: 0.0,
      function_ratios: {
        thinking: 0.25,
        feeling: 0.25,
        sensation: 0.25,
        intuition: 0.25
      }
    },
    crisis_flag: false
  };
}
