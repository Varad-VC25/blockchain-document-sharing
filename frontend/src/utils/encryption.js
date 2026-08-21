// ================================================================
// FRONTEND ENCRYPTION - Client-Side AES-256 via Web Crypto API
// ================================================================
// Encrypts files IN THE BROWSER before uploading anywhere.
// This ensures zero-knowledge architecture:
// - Backend never sees raw files
// - IPFS never receives raw files
// - Cloud storage never receives raw files
// - Only YOU can decrypt with the key
//
// Uses the same AES-256-CBC algorithm as backend for compatibility.
// ================================================================

// -- Utility: Convert hex string to Uint8Array ---------------------
const hexToBytes = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

// -- Utility: Convert Uint8Array to hex string ---------------------
const bytesToHex = (bytes) => {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// -- Import AES key into Web Crypto API ----------------------------
// In production: key comes from backend after user authentication
// For now: uses a shared key (backend + frontend must match)
// SECURITY NOTE: Backend must never expose the master key.
// Real production: derive user-specific keys from user password
const getEncryptionKey = async (keyHex) => {
  // If no key provided, this will fail - key MUST come from backend
  if (!keyHex || keyHex.length !== 64) {
    throw new Error("Invalid encryption key. Must be 64 hex characters.");
  }

  const keyBytes = hexToBytes(keyHex);

  return await window.crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// -- Encrypt a File or Blob ----------------------------------------
// Input:  File object + encryption key hex
// Output: {
//   encryptedBlob: Blob (IV + encrypted data),
//   originalSize: number,
//   encryptedSize: number,
//   iv: string (hex),
//   hash: string (SHA-256 of original file),
//   algorithm: string
// }
export const encryptFile = async (file, keyHex) => {
  try {
    if (!file) throw new Error("No file provided");

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Get encryption key
    const key = await getEncryptionKey(keyHex);

    // Generate cryptographically random IV (16 bytes for AES-CBC)
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // Encrypt the file
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: iv },
      key,
      arrayBuffer
    );

    // Combine IV + encrypted data (matching backend format)
    const encryptedBytes = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(iv.length + encryptedBytes.length);
    combined.set(iv, 0);
    combined.set(encryptedBytes, iv.length);

    // Create encrypted Blob
    const encryptedBlob = new Blob([combined], {
      type: "application/octet-stream",
    });

    // Generate SHA-256 hash of ORIGINAL file (for integrity checks)
    const hash = await generateFileHash(arrayBuffer);

    return {
      encryptedBlob,
      originalSize: file.size,
      encryptedSize: encryptedBlob.size,
      iv: bytesToHex(iv),
      hash: hash,
      algorithm: "AES-256-CBC",
    };
  } catch (error) {
    throw new Error("Encryption failed: " + error.message);
  }
};

// -- Decrypt an encrypted Blob -------------------------------------
// Input:  Encrypted Blob + encryption key hex
// Output: ArrayBuffer (original file bytes)
export const decryptFile = async (encryptedBlob, keyHex) => {
  try {
    if (!encryptedBlob) throw new Error("No encrypted blob provided");

    // Read encrypted data
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    const combined = new Uint8Array(arrayBuffer);

    if (combined.length < 16) {
      throw new Error("Encrypted data too short (missing IV)");
    }

    // Extract IV (first 16 bytes)
    const iv = combined.slice(0, 16);

    // Extract encrypted data (rest)
    const encryptedData = combined.slice(16);

    // Get encryption key
    const key = await getEncryptionKey(keyHex);

    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      key,
      encryptedData
    );

    return decryptedBuffer;
  } catch (error) {
    throw new Error("Decryption failed: " + error.message);
  }
};

// -- Generate SHA-256 hash of a file or buffer ---------------------
export const generateFileHash = async (fileOrBuffer) => {
  try {
    let arrayBuffer;
    if (fileOrBuffer instanceof File || fileOrBuffer instanceof Blob) {
      arrayBuffer = await fileOrBuffer.arrayBuffer();
    } else if (fileOrBuffer instanceof ArrayBuffer) {
      arrayBuffer = fileOrBuffer;
    } else {
      throw new Error("Input must be File, Blob, or ArrayBuffer");
    }

    const hashBuffer = await window.crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = new Uint8Array(hashBuffer);
    return bytesToHex(hashArray);
  } catch (error) {
    throw new Error("Hash generation failed: " + error.message);
  }
};

// -- Verify file integrity against expected hash -------------------
export const verifyFileIntegrity = async (file, expectedHash) => {
  const actualHash = await generateFileHash(file);
  return {
    valid: actualHash === expectedHash,
    actualHash,
    expectedHash,
  };
};

// -- Test the encryption system (call from browser console) --------
export const testEncryption = async (keyHex) => {
  try {
    console.log("Testing frontend AES-256 encryption...");

    const testText = "BlockDocs frontend encryption test.";
    const testBlob = new Blob([testText], { type: "text/plain" });
    const testFile = new File([testBlob], "test.txt", { type: "text/plain" });

    // Encrypt
    const encrypted = await encryptFile(testFile, keyHex);
    console.log("Original size:", encrypted.originalSize, "bytes");
    console.log("Encrypted size:", encrypted.encryptedSize, "bytes");
    console.log("Hash:", encrypted.hash);
    console.log("IV:", encrypted.iv);

    // Decrypt
    const decryptedBuffer = await decryptFile(encrypted.encryptedBlob, keyHex);
    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    console.log("Decrypted:", decryptedText);
    console.log("Match:", decryptedText === testText);

    return {
      success: true,
      match: decryptedText === testText,
      hash: encrypted.hash,
    };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error: error.message };
  }
};

export default {
  encryptFile,
  decryptFile,
  generateFileHash,
  verifyFileIntegrity,
  testEncryption,
};
