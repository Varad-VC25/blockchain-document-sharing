const { ethers, network } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  console.log("=================================================");
  console.log(" Deploying DocumentRegistry Smart Contract");
  console.log(" Network:", network.name);
  console.log("=================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with wallet address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Wallet ETH Balance:", ethers.formatEther(balance), "ETH");

  if (network.name === "sepolia" && balance === 0n) {
    console.error("ERROR: Deployer wallet has 0 Sepolia ETH!");
    process.exit(1);
  }

  const DocumentRegistry = await ethers.getContractFactory("DocumentRegistry");
  const contract = await DocumentRegistry.deploy();

  console.log("Transaction sent. Waiting for deployment confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("SUCCESS: DocumentRegistry Deployed!");
  console.log("Contract Address:", contractAddress);

  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/DocumentRegistry.sol/DocumentRegistry.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const frontendConfigDir = path.join(__dirname, "../frontend/src/config");
  if (!fs.existsSync(frontendConfigDir)) {
    fs.mkdirSync(frontendConfigDir, { recursive: true });
  }

  const frontendConfigFile = path.join(frontendConfigDir, "contract.js");
  const frontendConfigContent = `// Auto-generated contract configuration\n` +
    `export const CONTRACT_ADDRESS = "${contractAddress}";\n` +
    `export const CONTRACT_CHAIN_ID = ${network.config.chainId || 11155111};\n` +
    `export const CONTRACT_NETWORK_NAME = "${network.name}";\n\n` +
    `export const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};\n\n` +
    `export default {\n` +
    `  address: CONTRACT_ADDRESS,\n` +
    `  chainId: CONTRACT_CHAIN_ID,\n` +
    `  networkName: CONTRACT_NETWORK_NAME,\n` +
    `  abi: CONTRACT_ABI,\n` +
    `};\n`;

  fs.writeFileSync(frontendConfigFile, frontendConfigContent, "utf8");
  console.log("Contract address & ABI exported to frontend/src/config/contract.js");
  console.log("=================================================");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});