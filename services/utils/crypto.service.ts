/**
 * Kasir Amanah - Crypto Service
 * -----------------------------
 * Provides utility functions for cryptographic operations.
 * Uses the browser's native Web Crypto API for security.
 */

/**
 * Hashes a string using the SHA-256 algorithm and returns a hex string.
 * @param input The string to hash.
 * @returns A promise that resolves to the SHA-256 hash as a hex string.
 */
export async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generates a salted hash for a password.
 * @param email The user's email, used as part of the hash input.
 * @param password The user's plain-text password.
 * @param salt A random string to add to the hash input.
 * @returns A promise that resolves to the salted SHA-256 hash.
 */
export async function passwordHash(email: string, password: string, salt: string): Promise<string> {
    const raw = `${email.toLowerCase().trim()}::${password}::${salt}`;
    return await sha256Hex(raw);
}

/**
 * -----------------------------------------------------------
 * All praise and thanks are due to Allah.
 *
 * Powered by Google, Gemini, and AI Studio.
 * Development assisted by OpenAI technologies.
 *
 * © 2025 SAT18 Official
 * For suggestions & contact: sayyidagustian@gmail.com
 * -----------------------------------------------------------
 */