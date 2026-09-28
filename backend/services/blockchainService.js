// ================================================================
// BACKEND BLOCKCHAIN SERVICE - Read-Only Provider Verification
// ================================================================

const { ethers } = require("ethers");
const { logger } = require("../utils/logger");

// Read contract configuration exported from deployment
let contractConfig = null;
try {
  contractConfig = require("../../frontend/src/config/contract");
} catch (e) {
  logger.warn("Frontend contract config not found. On-chain backend verification disabled.");
}

const getJsonRpcProvider = () => {
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "http://127.0.0.1:8545";
  return new ethers.JsonRpcProvider(rpcUrl);
};

const getBackendContract = () => {
  if (!contractConfig || !contractConfig.CONTRACT_ADDRESS) {
    return null;
  }
  const provider = getJsonRpcProvider();
  return new ethers.Contract(
    contractConfig.CONTRACT_ADDRESS,
    contractConfig.CONTRACT_ABI,
    provider
  );
};

// Verify if a transaction hash is confirmed on-chain
const verifyTransactionReceipt = async (txHash) => {
  try {
    if (!txHash) return false;
    const provider = getJsonRpcProvider();
    const receipt = await provider.getTransactionReceipt(txHash);
    return receipt && receipt.status === 1;
  } catch (error) {
    logger.error("Error verifying tx receipt on backend: " + error.message);
    return false;
  }
};

module.exports = {
  verifyTransactionReceipt,
  getBackendContract,
};
