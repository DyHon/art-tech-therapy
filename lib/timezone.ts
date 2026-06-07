/**
 * Resolves a user's timezone from their `personaMask` metadata.
 *
 * Why this exists (PROCESS.md Step 4.5): time-series snapshots must be recorded with
 * explicit awareness of the user's localized timezone, rather than blindly trusting the
 * database's server-side UTC default. The resolved IANA zone is stored on each
 * `UserSnapshot` so the dashboard (Milestone 5) can bucket history by the user's local
 * day instead of the server's day.
 */
export function getUserTimezone(personaMask: unknown): string {
  if (personaMask && typeof personaMask === "object" && "timezone" in personaMask) {
    const tz = (personaMask as { timezone?: unknown }).timezone;
    if (typeof tz === "string" && isValidTimezone(tz)) {
      return tz;
    }
  }
  return "UTC";
}

/** True if `tz` is a valid IANA timezone identifier accepted by the Intl API. */
export function isValidTimezone(tz: string): boolean {
  if (!tz.trim()) return false;
  try {
    // Throws a RangeError for an unrecognized time zone.
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
