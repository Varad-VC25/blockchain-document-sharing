// ================================================================
// HASH SERVICE - SHA-256 Cryptographic Hashing
// ================================================================
// Generates and verifies SHA-256 hashes for document integrity.
// Same file always produces the same hash.
// Any single-byte modification produces a completely different hash.
// This is used to detect document tampering.
// ================================================================

const crypto = require("crypto");

// -- Generate SHA-256 hash from a Buffer ---------------------------
// Input:  Buffer (file bytes)
// Output: 64-character hex string
const generateHash = (buffer) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Input must be a Buffer");
  }
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
};

// -- Generate SHA-256 hash from a string ---------------------------
const generateHashFromString = (str) => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string");
  }
  return generateHash(Buffer.from(str, "utf8"));
};

// -- Verify that a buffer matches an expected hash -----------------
// Returns true if hashes match (data is authentic)
// Returns false if data has been modified
const verifyHash = (buffer, expectedHash) => {
  if (!buffer || !expectedHash) return false;
  const actualHash = generateHash(buffer);
  return actualHash === expectedHash;
};

// -- Generate a cryptographically secure random hex string ---------
// Useful for tokens, IDs, and one-time codes
const generateRandomHex = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

// -- Generate MD5 hash (only for non-security uses like caching) ---
const generateMD5 = (buffer) => {
  return crypto.createHash("md5").update(buffer).digest("hex");
};

module.exports = {
  generateHash,
  generateHashFromString,
  verifyHash,
  generateRandomHex,
  generateMD5,
};
