import { expect } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-chai-matchers";

describe("ExampleToken", () => {
  it("mints only by owner", async () => {
    const [, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy(ethers.parseUnits("1000000")); // maxSupply

    await token.mint(user.address, 100n);
    expect(await token.totalSupply()).to.equal(100n);
    expect(await token.balanceOf(user.address)).to.equal(100n);
  });

  it("reverts mint from non-owner", async () => {
    const [, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy(ethers.parseUnits("1000000"));

    await expect(token.connect(user).mint(user.address, 1n)).to.be.reverted;
  });

  it("pauses transfers", async () => {
    const [, user1, user2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ExampleToken");
    const token = await Token.deploy(1000n);

    await token.mint(user1.address, 100n);
    await token.pause();
    await expect(token.connect(user1).transfer(user2.address, 1n)).to.be.reverted;
  });
});

