import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const ITERATIONS = 10000;

/**
 * Resolves the master encryption key material from the environment.
 *
 * Fails fast (throws) when ENCRYPTION_KEY is absent. We deliberately never fall
 * back to a hardcoded constant: doing so would encrypt user PII under a publicly
 * known key, silently violating the Zero Data Retention / PII boundary.
 */
function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "ENCRYPTION_KEY is not set. Refusing to encrypt/decrypt PII without a configured key."
    );
  }
  // Derive a 32-byte key from the configured secret.
  return crypto.pbkdf2Sync(raw, "salt-constant-psyche", ITERATIONS, KEY_LENGTH, "sha256");
}

/**
 * Encrypts cleartext using AES-256-GCM.
 * Output format: iv:authTag:encrypted (all hex-encoded).
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM string produced by `encrypt`.
 *
 * Throws on malformed input or on any authentication/decryption failure. We never
 * return the input unchanged on error: a failed decrypt must surface loudly rather
 * than leak ciphertext (or a forged payload) downstream as if it were plaintext.
 */
export function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Malformed ciphertext: expected iv:authTag:encrypted format.");
  }

  const [ivHex, authTagHex, encryptedTextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = getKey();

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedTextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
