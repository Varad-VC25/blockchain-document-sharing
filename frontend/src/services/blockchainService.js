// ================================================================
// FRONTEND BLOCKCHAIN SERVICE - Ethers.js Contract Interaction
// ================================================================
// Interacts directly with DocumentRegistry.sol via MetaMask
// ================================================================

import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@config/contract";

// Check if MetaMask provider is available
const getEthereumProvider = () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to interact with the blockchain.");
  }
  return new BrowserProvider(window.ethereum);
};

// Get Contract instance connected to MetaMask signer (for write transactions)
export const getSignerContract = async () => {
  const provider = getEthereumProvider();
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Get Contract instance connected to read-only provider
export const getReadOnlyContract = async () => {
  const provider = getEthereumProvider();
  return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// -- Register Document on Blockchain ------------------------------
export const registerDocumentOnChain = async (document) => {
  try {
    const contract = await getSignerContract();

    console.log("Submitting transaction to register document on-chain:", document.title);

    // Call registerDocument on Solidity smart contract
    const tx = await contract.registerDocument(
      document.ipfsCid,
      document.fileHash,
      document.originalFileName || document.title,
      document.mimeType || "application/octet-stream",
      document.fileSize || 0
    );

    console.log("Transaction submitted. Hash:", tx.hash);

    // Wait for 1 block confirmation
    const receipt = await tx.wait(1);
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    console.error("Blockchain registration error:", error);
    let msg = error.reason || error.message || "Blockchain transaction failed";
    if (String(msg).includes("user rejected")) {
      msg = "Transaction rejected in MetaMask";
    }
    throw new Error(msg);
  }
};

// -- Check On-Chain Access Permission -----------------------------
export const checkOnChainAccess = async (ipfsCid, walletAddress) => {
  try {
    const contract = await getReadOnlyContract();
    const hasAccess = await contract.checkAccess(ipfsCid, walletAddress);
    return hasAccess;
  } catch (error) {
    console.error("Check on-chain access error:", error);
    return false;
  }
};

// -- Verify On-Chain Integrity Hash -------------------------------
export const verifyOnChainIntegrity = async (ipfsCid, fileHash) => {
  try {
    const contract = await getReadOnlyContract();
    const isMatch = await contract.verifyIntegrity(ipfsCid, fileHash);
    return isMatch;
  } catch (error) {
    console.error("Verify on-chain integrity error:", error);
    return false;
  }
};

// -- Fetch On-Chain Metadata ---------------------------------------
export const getOnChainMetadata = async (ipfsCid) => {
  try {
    const contract = await getReadOnlyContract();
    const doc = await contract.getDocument(ipfsCid);
    return {
      ipfsCid: doc.ipfsCid,
      fileHash: doc.fileHash,
      owner: doc.owner,
      timestamp: Number(doc.timestamp),
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      fileSize: Number(doc.fileSize),
      version: Number(doc.version),
      exists: doc.exists,
    };
  } catch (error) {
    console.error("Get on-chain metadata error:", error);
    return null;
  }
};

export default {
  registerDocumentOnChain,
  checkOnChainAccess,
  verifyOnChainIntegrity,
  getOnChainMetadata,
};


// -- Grant Access On-Chain -----------------------------------------
export const grantAccessOnChain = async (ipfsCid, recipientAddress) => {
  try {
    const contract = await getSignerContract();
    console.log("Granting access on-chain for CID:", ipfsCid, "to:", recipientAddress);

    const tx = await contract.grantAccess(ipfsCid, recipientAddress);
    console.log("Grant access transaction submitted:", tx.hash);

    const receipt = await tx.wait(1);
    console.log("Grant access confirmed in block:", receipt.blockNumber);

    return {
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Grant access on-chain error:", error);
    let msg = error.reason || error.message || "Grant access transaction failed";
    if (String(msg).includes("user rejected")) {
      msg = "Transaction rejected in MetaMask";
    }
    throw new Error(msg);
  }
};
