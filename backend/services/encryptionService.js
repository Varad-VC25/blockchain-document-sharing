// ================================================================
// ENCRYPTION SERVICE - AES-256-CBC Encryption/Decryption
// ================================================================
// Provides secure file encryption using AES-256 in CBC mode.
//
// Security Features:
// - AES-256 (256-bit key = 2^256 possible keys)
// - CBC mode with random IV for each encryption
// - IV prepended to encrypted output (16 bytes)
// - Format: [IV: 16 bytes] + [Encrypted Data: variable]
//
// The IV (Initialization Vector) ensures that encrypting the same
// file twice produces different ciphertexts, preventing pattern analysis.
// ================================================================

const crypto = require("crypto");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;      // 128-bit IV
const KEY_LENGTH = 32;     // 256-bit key

// -- Get encryption key from environment variable ------------------
// Key must be a 64-character hex string (32 bytes)
const getEncryptionKey = () => {
  const keyHex = process.env.AES_SECRET_KEY;

  if (!keyHex) {
    throw new Error("AES_SECRET_KEY not defined in environment variables");
  }

  if (keyHex.length !== 64) {
    throw new Error("AES_SECRET_KEY must be 64 hex characters (32 bytes)");
  }

  const keyBuffer = Buffer.from(keyHex, "hex");

  if (keyBuffer.length !== KEY_LENGTH) {
    throw new Error("AES_SECRET_KEY must decode to exactly 32 bytes");
  }

  return keyBuffer;
};

// -- Encrypt a Buffer ----------------------------------------------
// Input:  Buffer (raw file bytes)
// Output: {
//   encryptedBuffer: Buffer (IV + encrypted data),
//   iv: string (hex),
//   algorithm: string,
//   originalSize: number,
//   encryptedSize: number
// }
const encryptBuffer = (buffer) => {
  try {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error("Input must be a Buffer");
    }

    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher instance
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt data in chunks and combine
    const encryptedChunks = [
      cipher.update(buffer),
      cipher.final(),
    ];
    const encrypted = Buffer.concat(encryptedChunks);

    // Prepend IV to encrypted data (IV needed for decryption)
    // Format: [IV][EncryptedData]
    const finalBuffer = Buffer.concat([iv, encrypted]);

    return {
      encryptedBuffer: finalBuffer,
      iv: iv.toString("hex"),
      algorithm: ALGORITHM,
      originalSize: buffer.length,
      encryptedSize: finalBuffer.length,
    };
  } catch (error) {
    throw new Error("Encryption failed: " + error.message);
  }
};

// -- Decrypt a Buffer ----------------------------------------------
// Input:  Encrypted Buffer (IV prepended)
// Output: Original Buffer
const decryptBuffer = (encryptedBuffer) => {
  try {
    if (!Buffer.isBuffer(encryptedBuffer)) {
      throw new Error("Input must be a Buffer");
    }

    if (encryptedBuffer.length < IV_LENGTH) {
      throw new Error("Encrypted buffer too short (missing IV)");
    }

    const key = getEncryptionKey();

    // Extract IV from first 16 bytes
    const iv = encryptedBuffer.slice(0, IV_LENGTH);

    // Extract encrypted data (rest)
    const encryptedData = encryptedBuffer.slice(IV_LENGTH);

    // Create decipher instance
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

    // Decrypt data
    const decryptedChunks = [
      decipher.update(encryptedData),
      decipher.final(),
    ];

    return Buffer.concat(decryptedChunks);
  } catch (error) {
    throw new Error("Decryption failed: " + error.message);
  }
};

// -- Encrypt a UTF-8 string ----------------------------------------
// Output is base64-encoded for safe transmission
const encryptString = (text) => {
  const buffer = Buffer.from(text, "utf8");
  const result = encryptBuffer(buffer);
  return result.encryptedBuffer.toString("base64");
};

// -- Decrypt a base64 string back to UTF-8 -------------------------
const decryptString = (encryptedText) => {
  const encryptedBuffer = Buffer.from(encryptedText, "base64");
  const decrypted = decryptBuffer(encryptedBuffer);
  return decrypted.toString("utf8");
};

// -- Generate a new random encryption key --------------------------
// Useful for initial setup or key rotation
const generateEncryptionKey = () => {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
};

// -- Self-test the encryption system -------------------------------
// Encrypts and decrypts a test string, then verifies match
// Returns { success: boolean, error?: string }
const testEncryption = () => {
  try {
    const testString = "BlockDocs AES-256 encryption test message.";
    const encrypted = encryptString(testString);
    const decrypted = decryptString(encrypted);

    if (decrypted !== testString) {
      throw new Error("Decrypted output does not match original");
    }

    return {
      success: true,
      algorithm: ALGORITHM,
      keyLength: KEY_LENGTH * 8 + " bits",
      ivLength: IV_LENGTH * 8 + " bits",
      original: testString,
      decrypted: decrypted,
      match: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  encryptBuffer,
  decryptBuffer,
  encryptString,
  decryptString,
  generateEncryptionKey,
  testEncryption,
  ALGORITHM,
  KEY_LENGTH,
  IV_LENGTH,
};
