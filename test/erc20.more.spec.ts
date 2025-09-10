import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// ✅ TypeChain imports
import type { ExampleToken, ExampleToken__factory } from "../typechain-types";

async function deployTokenFixture() {
  const [deployer, alice, bob, carol] = await ethers.getSigners();

  const Token = (await ethers.getContractFactory(
    "ExampleToken"
  )) as ExampleToken__factory;

  const token = (await Token.deploy(
    ethers.parseUnits("1000000", 18) // 1,000,000 tokens with 18 decimals
  )) as ExampleToken;

  await token.waitForDeployment();

  return { token, deployer, alice, bob, carol };
}

describe("ExampleToken — additional ERC20 behavior", () => {
  it("has name/symbol/decimals and a positive totalSupply", async () => {
    const { token } = await loadFixture(deployTokenFixture);

    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const total = await token.totalSupply();

    expect(name).to.be.a("string").and.not.equal("");
    expect(symbol).to.be.a("string").and.not.equal("");
    expect(decimals).to.be.greaterThan(0n);
    expect(total).to.be.greaterThan(0n);
  });

  it("approve returns true and emits Approval", async () => {
    const { token, alice, bob } = await loadFixture(deployTokenFixture);
    const amount = 12345n;

    await expect(token.connect(alice).approve(bob.address, amount))
      .to.emit(token, "Approval")
      .withArgs(alice.address, bob.address, amount);

    // call again just to assert no revert
    await token.connect(alice).approve(bob.address, amount);
  });

  it("transfer emits Transfer with correct from/to/amount", async () => {
    const { token, alice, bob } = await loadFixture(deployTokenFixture);

    const mintAmount = ethers.parseEther("1");
    await token.mint(alice.address, mintAmount);

    await expect(token.connect(alice).transfer(bob.address, 1n))
      .to.emit(token, "Transfer")
      .withArgs(alice.address, bob.address, 1n);
  });

  it("increaseAllowance / decreaseAllowance update allowances", async () => {
    const { token, alice, bob } = await loadFixture(deployTokenFixture);

    await token.connect(alice).increaseAllowance(bob.address, 100n);
    expect(await token.allowance(alice.address, bob.address)).to.equal(100n);

    await token.connect(alice).increaseAllowance(bob.address, 50n);
    expect(await token.allowance(alice.address, bob.address)).to.equal(150n);

    await token.connect(alice).decreaseAllowance(bob.address, 20n);
    expect(await token.allowance(alice.address, bob.address)).to.equal(130n);
  });

  it("transferFrom respects allowance and reduces it", async () => {
    const { token, alice, bob, carol } = await loadFixture(deployTokenFixture);

    await token.mint(alice.address, 1000n);
    await token.connect(alice).approve(bob.address, 300n);

    await token.connect(bob).transferFrom(alice.address, carol.address, 120n);

    expect(await token.balanceOf(carol.address)).to.equal(120n);
    expect(await token.allowance(alice.address, bob.address)).to.equal(180n);
  });

  it("overwrite approval directly still works", async () => {
    const { token, alice, bob } = await loadFixture(deployTokenFixture);

    await token.connect(alice).approve(bob.address, 10n);
    await token.connect(alice).approve(bob.address, 7n);
    expect(await token.allowance(alice.address, bob.address)).to.equal(7n);
  });
});

describe("ExampleToken — pausable/ownable guards", () => {
  it("only owner can pause / unpause", async () => {
    const { token, deployer, alice } = await loadFixture(deployTokenFixture);

    await expect(token.connect(alice).pause()).to.be.reverted;
    await expect(token.connect(deployer).pause()).to.not.be.reverted;

    await expect(token.connect(alice).unpause()).to.be.reverted;
    await expect(token.connect(deployer).unpause()).to.not.be.reverted;
  });

  it("transfers are blocked while paused", async () => {
    const { token, deployer, alice, bob } = await loadFixture(deployTokenFixture);

    await token.mint(alice.address, 10n);
    await token.connect(deployer).pause();

    await expect(token.connect(alice).transfer(bob.address, 1n)).to.be.reverted;
  });

  it("approvals still possible while paused", async () => {
    const { token, deployer, alice, bob } = await loadFixture(deployTokenFixture);

    await token.connect(deployer).pause();
    await token.connect(alice).approve(bob.address, 42n);

    expect(await token.allowance(alice.address, bob.address)).to.equal(42n);
  });
});

describe("ExampleToken — mint guardrails", () => {
  it("only owner can mint; balances + totalSupply update", async () => {
    const { token, deployer, alice } = await loadFixture(deployTokenFixture);

    await expect(token.connect(alice).mint(alice.address, 5n)).to.be.reverted;

    const beforeSupply = await token.totalSupply();
    await token.connect(deployer).mint(alice.address, 5n);

    expect(await token.balanceOf(alice.address)).to.equal(5n);
    expect(await token.totalSupply()).to.equal(beforeSupply + 5n);
  });
});
