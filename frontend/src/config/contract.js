export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CONTRACT_CHAIN_ID = 31337;
export const CONTRACT_NETWORK_NAME = "localhost";

export const CONTRACT_ABI = [
  "function registerDocument(string _ipfsCid, string _fileHash, string _fileName, string _mimeType, uint256 _fileSize) external",
  "function grantAccess(string _ipfsCid, address _recipient) external",
  "function revokeAccess(string _ipfsCid, address _recipient) external",
  "function checkAccess(string _ipfsCid, address _user) external view returns (bool)",
  "function isOwner(string _ipfsCid, address _user) external view returns (bool)",
  "function verifyIntegrity(string _ipfsCid, string _inputHash) external view returns (bool)",
  "function getDocument(string _ipfsCid) external view returns (tuple(string ipfsCid, string fileHash, address owner, uint256 timestamp, string fileName, string mimeType, uint256 fileSize, uint256 version, bool exists))"
];

export default {
  address: CONTRACT_ADDRESS,
  chainId: CONTRACT_CHAIN_ID,
  networkName: CONTRACT_NETWORK_NAME,
  abi: CONTRACT_ABI,
};
