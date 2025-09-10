import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Variant B: use mocha-multi-reporters with an external config file (mocha-multi.json).
 * - All tests run once (Hardhat), Mochawesome writes JSON shards.
 * - CI (or npm script) merges JSON -> generates a single HTML report for GitHub Pages.
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
  },

  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  etherscan: {
  apiKey: {
    sepolia: process.env.ETHERSCAN_API_KEY || "",
  },
},

  mocha: {
    require: ["@cspotcode/source-map-support/register"],
    reporter: "mocha-multi-reporters",
    reporterOptions: { configFile: "mocha-multi.json" },
    timeout: 600000,
  },
};

export default config;
