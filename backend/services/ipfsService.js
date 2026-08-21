// ================================================================
// IPFS SERVICE - Pinata free-tier integration
// ================================================================
// Uploads ONLY encrypted buffers to IPFS.
// Returns CID + gateway URL.
// ================================================================

const axios = require("axios");
const FormData = require("form-data");
const { getPinataAuthHeaders, getIpfsUrl } = require("../config/pinata");
const { logger } = require("../utils/logger");

const PINATA_PIN_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_UNPIN_URL = "https://api.pinata.cloud/pinning/unpin/";
const PINATA_TEST_URL = "https://api.pinata.cloud/data/testAuthentication";

// Test Pinata credentials
const testPinataConnection = async () => {
  try {
    const headers = getPinataAuthHeaders();
    const response = await axios.get(PINATA_TEST_URL, { headers, timeout: 15000 });
    return {
      success: true,
      message: response.data?.message || "Pinata authenticated",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || error.message,
    };
  }
};

// Upload encrypted buffer to IPFS via Pinata
// Returns: { cid, ipfsUrl, size, timestamp }
const uploadToIPFS = async (encryptedBuffer, fileName = "encrypted.bin", metadata = {}) => {
  try {
    if (!Buffer.isBuffer(encryptedBuffer)) {
      throw new Error("uploadToIPFS expects a Buffer");
    }

    const form = new FormData();
    form.append("file", encryptedBuffer, {
      filename: fileName,
      contentType: "application/octet-stream",
    });

    // Optional Pinata metadata
    const pinataMetadata = {
      name: fileName,
      keyvalues: {
        app: "BlockDocs",
        encrypted: "true",
        ...metadata,
      },
    };
    form.append("pinataMetadata", JSON.stringify(pinataMetadata));

    const pinataOptions = {
      cidVersion: 1,
    };
    form.append("pinataOptions", JSON.stringify(pinataOptions));

    const headers = {
      ...getPinataAuthHeaders(),
      ...form.getHeaders(),
    };

    const response = await axios.post(PINATA_PIN_URL, form, {
      headers,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 120000,
    });

    const cid = response.data.IpfsHash;
    if (!cid) {
      throw new Error("Pinata did not return IpfsHash");
    }

    const result = {
      cid,
      ipfsUrl: getIpfsUrl(cid),
      size: response.data.PinSize || encryptedBuffer.length,
      timestamp: response.data.Timestamp || new Date().toISOString(),
    };

    logger.info("IPFS upload success: " + cid);
    return result;
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    logger.error("IPFS upload failed: " + msg);
    throw new Error("IPFS upload failed: " + msg);
  }
};

// Fetch encrypted file from IPFS gateway
const fetchFromIPFS = async (cid) => {
  try {
    if (!cid) throw new Error("CID is required");

    const url = getIpfsUrl(cid);
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 60000,
    });

    return Buffer.from(response.data);
  } catch (error) {
    const msg = error.response?.status
      ? "HTTP " + error.response.status + " while fetching CID"
      : error.message;
    logger.error("IPFS fetch failed: " + msg);
    throw new Error("IPFS fetch failed: " + msg);
  }
};

// Unpin file from Pinata (cleanup / delete)
const unpinFromIPFS = async (cid) => {
  try {
    if (!cid) throw new Error("CID is required");
    const headers = getPinataAuthHeaders();
    await axios.delete(PINATA_UNPIN_URL + cid, { headers, timeout: 30000 });
    logger.info("IPFS unpin success: " + cid);
    return true;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    logger.error("IPFS unpin failed: " + msg);
    // Do not crash delete flow if unpin fails
    return false;
  }
};

module.exports = {
  testPinataConnection,
  uploadToIPFS,
  fetchFromIPFS,
  unpinFromIPFS,
};
