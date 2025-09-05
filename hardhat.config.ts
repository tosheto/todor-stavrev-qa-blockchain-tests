import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import * as dotenv from "dotenv";
dotenv.config();

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
    reporterOptions: {
      reporterEnabled: "spec, mocha-junit-reporter, mochawesome",
      mochaJunitReporterReporterOptions: {
        mochaFile: "reports/junit/test-results.xml",
        suiteName: "blockchain-qa-tests",
        useFullSuiteTitle: true,
        rootSuiteTitle: "All Tests",
        properties: {
          "artifactVersion": "1.0.0",
        },
      },
      mochawesomeReporterOptions: {
        reportDir: "reports/mochawesome",
        reportFilename: "report",
        quiet: true,
        overwrite: true,
        html: true,
        json: true,
      },
    },
    timeout: 40000,
  },
};

export default config;

