// ================================================================
// PINATA CONFIG - IPFS gateway and auth helpers
// ================================================================

const getPinataAuthHeaders = () => {
  const jwt = process.env.PINATA_JWT;
  const apiKey = process.env.PINATA_API_KEY;
  const secret = process.env.PINATA_SECRET_KEY;

  if (jwt && jwt !== "your_pinata_jwt_here" && jwt.trim() !== "") {
    return {
      Authorization: "Bearer " + jwt,
    };
  }

  if (
    apiKey &&
    secret &&
    apiKey !== "your_pinata_api_key_here" &&
    secret !== "your_pinata_secret_key_here"
  ) {
    return {
      pinata_api_key: apiKey,
      pinata_secret_api_key: secret,
    };
  }

  throw new Error(
    "Pinata credentials missing. Set PINATA_JWT (preferred) or PINATA_API_KEY + PINATA_SECRET_KEY in backend/.env"
  );
};

const getPinataGateway = () => {
  return process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/";
};

const getIpfsUrl = (cid) => {
  if (!cid) return null;
  const gateway = getPinataGateway();
  const base = gateway.endsWith("/") ? gateway : gateway + "/";
  return base + cid;
};

module.exports = {
  getPinataAuthHeaders,
  getPinataGateway,
  getIpfsUrl,
};
