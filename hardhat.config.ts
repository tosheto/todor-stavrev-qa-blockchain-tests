import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  gasReporter: { enabled: true, currency: "USD" },
  networks: { hardhat: {} },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6",
  },
};

export default config;
