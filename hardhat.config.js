// ================================================================
// HARDHAT CONFIGURATION FILE
// ================================================================
// Configures the Hardhat development environment for
// compiling, testing, and deploying Solidity smart contracts.
// ================================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Load environment variables safely
// If .env is missing, use empty defaults so Hardhat can still compile
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Solidity compiler version
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  // Network configurations
  networks: {
    // Local Hardhat development network
    hardhat: {
      chainId: 31337,
    },

    // Ethereum Sepolia Testnet
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },

    // Local node
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },

  // Etherscan configuration for contract verification
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },

  // Paths configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  // Gas reporter
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
