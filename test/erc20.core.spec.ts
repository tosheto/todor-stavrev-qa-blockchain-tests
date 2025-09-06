// test/erc20.core.spec.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import type { ExampleToken } from "../typechain-types";

// Helper: deploy while trying a few constructor signatures
async function deployToken(): Promise<ExampleToken> {
  const Factory = await ethers.getContractFactory("ExampleToken");
  const F = Factory as any;
  let token: ExampleToken;

  try {
    token = (await F.deploy("ExampleToken", "EXT", 1_000_000n)) as ExampleToken;
  } catch {
    try {
      token = (await F.deploy("ExampleToken", "EXT")) as ExampleToken;
    } catch {
      token = (await F.deploy()) as ExampleToken;
    }
  }
  return token;
}

describe("ExampleToken — core behavior", () => {
  let token: ExampleToken;
  let deployer: any, alice: any, bob: any;

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    token = await deployToken();

    // Ensure deployer has a starting balance if the contract exposes mint()
    const tAny = token as any;
    const me = await deployer.getAddress();
    const bal = await token.balanceOf(me);
    if (bal === 0n && tAny.mint) {
      await tAny.mint(me, 1_000_000n);
    }
  });

  it("has name/symbol if exposed", async () => {
    const tAny = token as any;
    if (tAny.name) expect(await tAny.name()).to.be.a("string");
    if (tAny.symbol) expect(await tAny.symbol()).to.be.a("string");
  });

  it("totalSupply > 0 and deployer has balance", async () => {
    const total = await token.totalSupply();
    expect(total).to.be.gt(0n);
    const balDeployer = await token.balanceOf(await deployer.getAddress());
    expect(balDeployer).to.be.gt(0n);
    expect(balDeployer).to.be.lte(total);
  });

  it("transfer moves balance and emits Transfer", async () => {
    const amount = 1_000n; // raw units, decimals-agnostic
    await expect(token.transfer(await alice.getAddress(), amount))
      .to.emit(token, "Transfer")
      .withArgs(await deployer.getAddress(), await alice.getAddress(), amount);

    expect(await token.balanceOf(await alice.getAddress())).to.equal(amount);
  });

  it("transfer 0 works and emits", async () => {
    const amount = 0n;
    await expect(token.transfer(await alice.getAddress(), amount))
      .to.emit(token, "Transfer")
      .withArgs(await deployer.getAddress(), await alice.getAddress(), amount);
  });

  it("self-transfer keeps net balance the same and emits", async () => {
    const me = await deployer.getAddress();
    const before = await token.balanceOf(me);
    const amount = 10n;
    await expect(token.transfer(me, amount))
      .to.emit(token, "Transfer")
      .withArgs(me, me, amount);
    const after = await token.balanceOf(me);
    expect(after).to.equal(before);
  });

  it("reverts when transferring more than balance", async () => {
    const aBal = await token.balanceOf(await alice.getAddress());
    const amount = aBal + 1n;
    await expect(
      token.connect(alice).transfer(await bob.getAddress(), amount)
    ).to.be.reverted;
  });

  it("reverts when transferring to the zero address", async () => {
    const amount = 1n;
    await expect(token.transfer(ethers.ZeroAddress, amount)).to.be.reverted;
  });

  it("approve sets allowance and emits Approval", async () => {
    const amount = 5_000n;
    await expect(token.approve(await alice.getAddress(), amount))
      .to.emit(token, "Approval")
      .withArgs(await deployer.getAddress(), await alice.getAddress(), amount);

    expect(
      await token.allowance(await deployer.getAddress(), await alice.getAddress())
    ).to.equal(amount);
  });

  it("transferFrom consumes allowance and moves funds", async () => {
    const amount = 777n;
    await token.approve(await alice.getAddress(), amount);

    await expect(
      token
        .connect(alice)
        .transferFrom(
          await deployer.getAddress(),
          await bob.getAddress(),
          amount
        )
    )
      .to.emit(token, "Transfer")
      .withArgs(await deployer.getAddress(), await bob.getAddress(), amount);

    expect(
      await token.allowance(await deployer.getAddress(), await alice.getAddress())
    ).to.equal(0n);
    expect(await token.balanceOf(await bob.getAddress())).to.equal(amount);
  });

  it("approve overwrite OR zero-first pattern (both accepted)", async () => {
    const spender = await alice.getAddress();
    const ten = 10n;
    const one = 1n;

    // set initial allowance
    await token.approve(spender, ten);

    let overwriteWorked = true;
    try {
      // try direct overwrite
      await token.approve(spender, one);
    } catch {
      overwriteWorked = false;
    }

    if (!overwriteWorked) {
      // some impls require zeroing first
      await token.approve(spender, 0n);
      await token.approve(spender, one);
    }

    expect(
      await token.allowance(await deployer.getAddress(), spender)
    ).to.equal(1n);
  });

  it("logs include Transfer event (topic parsing smoke test)", async () => {
    const amount = 42n;
    await token.transfer(await alice.getAddress(), amount);
    const tx = await token
      .connect(alice)
      .transfer(await bob.getAddress(), amount);
    const rc = await tx.wait();

    // ethers v6: parse logs using the contract interface
    const iface = (token as any).interface;
    const found = (rc?.logs ?? []).some((log: any) => {
      try {
        const parsed = iface.parseLog(log);
        return parsed?.name === "Transfer";
      } catch {
        return false;
      }
    });
    expect(found).to.equal(true);
  });
});
