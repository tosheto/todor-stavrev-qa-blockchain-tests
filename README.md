
# 🧪 todor-stavrev-qa-blockchain-tests

<div align="center">

[![Live Test Report](https://img.shields.io/badge/▶%20Live%20Test%20Report-Open%20now-blueviolet?logo=githubpages&logoColor=white)](https://tosheto.github.io/todor-stavrev-qa-blockchain-tests/)

![CI](https://github.com/tosheto/todor-stavrev-qa-blockchain-tests/actions/workflows/ci.yml/badge.svg)
[![Coverage](https://github.com/tosheto/todor-stavrev-qa-blockchain-tests/actions/workflows/coverage.yml/badge.svg?branch=main)](https://github.com/tosheto/todor-stavrev-qa-blockchain-tests/actions/workflows/coverage.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Node](https://img.shields.io/badge/node-20.x-informational)
![Hardhat](https://img.shields.io/badge/hardhat-2.26.x-yellow)
![CodeQL](https://github.com/tosheto/todor-stavrev-qa-blockchain-tests/actions/workflows/codeql.yml/badge.svg)

</div>

> [!IMPORTANT]
> **▶ Live Test Report:** → https://tosheto.github.io/todor-stavrev-qa-blockchain-tests/

Smart contract QA project using **Hardhat**, **TypeScript**, **Chai** and **TypeChain** for automated and manual testing.  
Includes a sample **ERC20 smart contract**, deployment script, and unit tests with gas usage metrics.

---
## 📸 Screenshots

### ✅ Passing tests
![Tests Screenshot](docs/screenshots/tests-passing.png)

### 📊 Gas usage report
![Gas Report](docs/screenshots/gas-report.png)


## 🚀 Features
- Hardhat setup with TypeScript support  
- Sample ERC20 contract (`ExampleToken.sol`)  
- Unit tests with Chai + Hardhat Chai Matchers  
- Type-safe contract interactions via TypeChain  
- Gas usage and deployment cost reporting  
- **Mochawesome** test reports with HTML + JSON output  
- **Coverage reports** (HTML, LCOV, JSON) via `solidity-coverage`  
- Automatic coverage upload to **Codecov**  
- **GitHub Pages** publishing of live test reports  
- Ready-to-use **CI/CD workflows**:
  - ✅ Tests
  - ✅ Coverage + Codecov upload
  - ✅ CodeQL security scan
  - ✅ GitHub Pages deploy of Mochawesome report  

---

## 📂 Project Structure
- `contracts/` → Solidity smart contracts  
- `scripts/` → Deployment scripts  
- `test/` → Automated tests in TypeScript  
- `typechain-types/` → Auto-generated TypeChain typings  
- `reports/` → Test + coverage outputs (Mochawesome, LCOV, JUnit)  
- `.github/workflows/` → CI/CD workflows for GitHub Actions  
- `hardhat.config.ts` → Hardhat configuration  

---

## ⚡ Getting Started

1. **Install dependencies**
   ```bash
   npm install

2. **Compile Contracts** 
    ```bash
    npx hardhat compile

3. **Run Tests** 
    ```bash
    npm test
4. **Deploy Locally (Hardhat network)** 
    ```bash
    npx hardhat run scripts/deploy.ts

## 🚀 Tech Stack
-  Solidity (v0.8.20)
-  Hardhat (with toolbox)
-  TypeScript
-  Chai + Hardhat Chai Matchers
-  TypeChain (ethers v6 bindings)

## 📂 License
-  This project is licensed under the MIT License.
