todor-stavrev-qa-blockchain-tests

Smart contract QA project using Hardhat, TypeScript, Chai and TypeChain for manual and automated testing.
Includes sample ERC20 smart contract, deployment script, and unit tests with gas usage metrics.

🚀 Features

Hardhat setup with TypeScript support

Sample ERC20 contract (ExampleToken.sol)

Unit tests with Chai + Hardhat Chai Matchers

Type-safe contract interactions via TypeChain

Gas usage and deployment cost reporting

Ready for CI/CD and GitHub Actions integration

📂 Project Structure
contracts/        # Solidity smart contracts
scripts/          # Deployment scripts
test/             # Automated tests in TypeScript
typechain-types/  # Auto-generated TypeChain typings
hardhat.config.ts # Hardhat configuration

⚡ Getting Started
1. Install dependencies
npm install

2. Compile contracts
npx hardhat compile

3. Run tests
npm test

4. Deploy locally (Hardhat network)
npx hardhat run scripts/deploy.ts

🛠️ Tech Stack

Solidity (v0.8.20)

Hardhat (with toolbox)

TypeScript

Chai / Mocha for assertions

TypeChain for typed contract bindings

📜 License

This project is licensed under the MIT License
.
