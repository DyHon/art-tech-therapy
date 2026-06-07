/**
 * Crisis support resources shown on the /safety route when ShadowGuard intercepts a
 * crisis signal. Kept as data (not hardcoded in JSX) so it is testable and easy to keep
 * current. We lead with authoritative directories rather than many hardcoded numbers, so
 * a stale entry can never send someone to a wrong/disconnected line.
 */
export interface CrisisResource {
  region: string;
  name: string;
  /** Human-readable contact (phone, text, or web). */
  contact: string;
  /** `tel:` or `https://` link, when applicable. */
  href?: string;
  note?: string;
  available?: string;
}

/** Shown most prominently — immediate-danger instruction. */
export const EMERGENCY_NOTE =
  "If you are in immediate danger or thinking about harming yourself, call your local emergency number now — for example 115 or 113 (Vietnam), 911 (US/Canada), 112 (EU), or 999 (UK).";

export const crisisResources: CrisisResource[] = [
  {
    region: "Global",
    name: "Find A Helpline",
    contact: "findahelpline.com",
    href: "https://findahelpline.com",
    note: "Free, confidential helplines in 130+ countries — choose yours, including Vietnam.",
    available: "Varies by country",
  },
  {
    region: "Global",
    name: "Befrienders Worldwide",
    contact: "befrienders.org",
    href: "https://www.befrienders.org",
    note: "International network of emotional-support centres.",
    available: "Varies by country",
  },
  {
    region: "United States",
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or text 988",
    href: "tel:988",
    available: "24/7",
  },
  {
    region: "United Kingdom & Ireland",
    name: "Samaritans",
    contact: "116 123",
    href: "tel:116123",
    note: "Free to call; you don't have to be suicidal to reach out.",
    available: "24/7",
  },
];
