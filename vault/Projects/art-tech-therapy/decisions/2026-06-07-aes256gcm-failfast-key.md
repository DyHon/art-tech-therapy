# Harden encryption: fail-fast key resolution and throwing decryption

- Date: 2026-06-07
- Status: accepted

## Context
`lib/security/encryption.ts` had two weaknesses for a system bound by a Zero-Data-
Retention / PII policy:
1. `getKey()` fell back to a hardcoded constant (`"fallback-temporary-secret-key..."`)
   when `ENCRYPTION_KEY` was unset. `.env` did **not** define `ENCRYPTION_KEY`, so the
   running system was encrypting PII under a publicly-known key.
2. `decrypt()` silently returned its input unchanged on malformed format or on
   GCM authentication failure — meaning a forged or corrupted payload could flow
   downstream as if it were valid plaintext.

## Decision
- `getKey()` throws if `ENCRYPTION_KEY` is absent. No fallback key, ever.
- `decrypt()` throws on malformed input (not `iv:authTag:encrypted`) and lets GCM
  auth failures propagate. It never returns the input on error.
- Algorithm, salt, and PBKDF2 iteration count were left unchanged to avoid invalidating
  any already-encrypted data.
- A real dev key was added to the (gitignored) `.env`; tests use an inline test-only key.

## Alternatives considered
- **Keep a dev fallback but only throw in production** — rejected; still risks a silent
  weak-key path and a `NODE_ENV` misconfiguration leaking into prod.
- **Use `ENCRYPTION_KEY` bytes directly instead of PBKDF2** — deferred; would change the
  derived key and invalidate existing ciphertexts. Out of scope for a hardening fix.
- **Log-and-return on decrypt failure** — rejected; that is precisely the silent-failure
  footgun being removed.

## Consequences
- Missing key now surfaces loudly at startup/first-use rather than failing open.
- Any *dev* rows encrypted under the old public fallback key can no longer be decrypted
  (acceptable; that key was effectively public, and there is no production data pre-M4).
- Validated: 13/13 Vitest pass, `tsc --noEmit` clean.
