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
Includes a sample **ERC20 smart contract**, deployment script, linting setup, and CI/CD integration.

---

## 📸 Screenshots

### ✅ Passing tests
![Tests Screenshot](docs/screenshots/tests-passing.png)

### 📊 Gas usage report
![Gas Report](docs/screenshots/gas-report.png)

---

## 🚀 Features
- Hardhat setup with TypeScript support  
- Sample ERC20 contract (`ExampleToken.sol`)  
- Unit tests with Chai + Hardhat Chai Matchers  
- Type-safe contract interactions via TypeChain  
- Gas usage and deployment cost reporting  
- **Mochawesome** test reports (HTML + JSON) auto-published to GitHub Pages  
- **Coverage reports** (HTML, LCOV, JSON) via `solidity-coverage` + Codecov upload  
- **ESLint + Prettier** for TypeScript/JavaScript linting & formatting  
- **Solhint** for Solidity linting (with Prettier plugin)  
- **Husky + lint-staged** pre-commit hooks for auto-lint/format  
- **Cross-platform build commands** using `shx`  
- Ready-to-use **GitHub Actions workflows**:
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
- `.husky/` → Git hooks for linting (pre-commit)  
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
    
4. **Generate Mochawesome HTML report** 
    ```bash
    npm run test:report

5. **Run Solidity Coverage** 
    ```bash
    npm run coverage
    
6. **Deploy Locally (Hardhat network)** 
    ```bash
    npx hardhat run scripts/deploy.ts
    
## 🛠️ Development Setup

Install dev tooling for linting, formatting, Solidity rules and test reports:

1. **Test report tooling (Mochawesome)**
   ```bash
   npm i -D mochawesome@7 mochawesome-merge@4 mochawesome-report-generator@6 \
         mocha-junit-reporter mocha-multi-reporters
2. **For cross-platform shell (mkdir/cp on Windows)** 
    ```bash
    npm i -D shx
3. **Linting & formatting (TS/JS)** 
    ```bash
    npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
         prettier eslint-config-prettier eslint-plugin-prettier
4. **Git hooks (run linters before commit)** 
    ```bash
    npm i -D husky lint-staged
    npx husky init
    
5. **Solidity linting** 
    ```bash
   npm i -D solhint solhint-plugin-prettier
   npx solhint --init
    
 🧪 Reports & Coverage

- HTML test report (Mochawesome):
- npm run test:report → reports/mocha/index.html
- Published automatically to GitHub Pages: https://tosheto.github.io/todor-stavrev-qa-blockchain-tests/

- Solidity coverage:
- npm run coverage → coverage/ (HTML, JSON, LCOV)
- CI uploads artifacts and sends to Codecov.
  
## 🤖 CI/CD Workflows

`ci.yml` → install, build, run tests (status badge in README)

`coverage.yml` → run `solidity-coverage`, upload artifacts, upload to Codecov

`codeql.yml` → CodeQL static analysis

`publish.ymlж → build + deploy Mochawesome HTML report to GitHub Pages

To enable Codecov uploads: add repository secret `CODECOV_TOKEN` in
`Settings → Secrets and variables → Actions`.

## 🚀 Tech Stack
- Solidity (v0.8.20)
- Hardhat (with toolbox)
- TypeScript
- Chai + Hardhat Chai Matchers
- TypeChain (ethers v6 bindings)
- ESLint + Prettier
- Solhint + Prettier plugin
- Husky + lint-staged
- Mochawesome reporting
- GitHub Actions CI/CD

## 📂 License
-  This project is licensed under the MIT License.
