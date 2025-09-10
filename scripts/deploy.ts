import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying contract to Sepolia...");

  // Get the contract factory (replace ExampleToken with your contract name if different)
  const ExampleToken = await ethers.getContractFactory("ExampleToken");

  // Deploy with an initial supply of 1,000,000 tokens (adjust as needed)
  const initialSupply = ethers.parseEther("1000000");
  const token = await ExampleToken.deploy(initialSupply);

  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log("✅ ExampleToken deployed to:", address);
  console.log("👉 Constructor arguments:", initialSupply.toString());
}

// Proper error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
