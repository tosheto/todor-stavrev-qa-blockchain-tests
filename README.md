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

## 🧪 Test Suite Overview

The project ships with a **constructor-agnostic and decimals-agnostic ERC-20 test suite**.  
This means you can drop in *any* ERC-20 contract and the suite will still validate its core logic without manual tweaks.

### ✅ Coverage
- **Core Transfers**
  - happy path transfer
  - transfer of `0` tokens
  - self-transfer (net-zero effect)
  - revert on overspend
  - revert on transfer to zero address  
- **Allowances**
  - `approve` emits `Approval`
  - `transferFrom` deducts allowance and transfers funds
  - overwrite allowance directly
  - overwrite allowance with “zero-first” pattern  
- **Events**
  - `Transfer` and `Approval` event emission  
- **Invariants (Fuzz)**
  - randomized valid transfers always preserve `totalSupply`  

### 📊 Test Matrix

| Area                  | What it checks                                             | Cases |
|-----------------------|------------------------------------------------------------|------:|
| Core transfers        | happy, zero, self, overspend revert, zero-address revert   | 7     |
| Allowances            | approve, transferFrom, overwrite, zero-first overwrite     | 4     |
| Events                | `Transfer` + `Approval` events                            | 1     |
| Property-based (fuzz) | randomized transfers → supply invariant                    | 1     |
| Existing project      | baseline example tests                                     | 3     |

**Total**: **16+ tests** (11 core + 1 fuzz + 3 baseline + future extensions)

---
### 🔍 Example Test (excerpt)

```ts
it("should revert if transfer amount exceeds balance", async () => {
  const { token, alice, bob } = await loadFixture(deployTokenFixture);
  await expect(token.connect(alice).transfer(bob.address, 999999))
    .to.be.revertedWith("ERC20: transfer amount exceeds balance");
});
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
- **Husky + lint-staged** pre-commit hooks  
- **Constructor-agnostic & decimals-agnostic test suite** (works across common ERC-20 variants)  
- **Allowance overwrite safety** (supports “zero-first” pattern as well as direct overwrite)  
- **Property-based fuzzing** for supply invariants  
- Ready-to-use **GitHub Actions**: Tests, Coverage + Codecov, CodeQL, Pages deploy

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
    
## 🧪 Reports & Coverage

- HTML test report (Mochawesome):
- npm run test:report → reports/mocha/index.html
- Published automatically to GitHub Pages: https://tosheto.github.io/todor-stavrev-qa-blockchain-tests/
- Solidity coverage:
- npm run coverage → coverage/ (HTML, JSON, LCOV)
- CI uploads artifacts and sends to Codecov.
  
## 🤖 CI/CD Workflows

- `ci.yml` → install, build, run tests (status badge in README)
- `coverage.yml` → run `solidity-coverage`, upload artifacts, upload to Codecov
- `codeql.yml` → CodeQL static analysis
- `publish.yml` → build + deploy Mochawesome HTML report to GitHub Pages
- To enable Codecov uploads: add repository secret `CODECOV_TOKEN` in
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
