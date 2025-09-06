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
  },

  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },

  mocha: {
    reporter: "mocha-multi-reporters",
    // Use a shared external config so local runs and CI stay in sync
    reporterOptions: { configFile: "mocha-multi.json" },
    timeout: 600000, // generous for CI
  },
};

export default config;
