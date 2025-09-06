// test/erc20.core.spec.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import type { ExampleToken } from "../typechain-types";

/** Deploys ExampleToken by trying several constructor signatures safely. */
async function deployToken(): Promise<ExampleToken> {
  const Factory = await ethers.getContractFactory("ExampleToken");
  const F = Factory as any;

  // Try most common signatures in order
  const candidates: any[][] = [
    ["ExampleToken", "EXT", 1_000_000n], // (name, symbol, initialSupply)
    ["ExampleToken", "EXT"],            // (name, symbol)
    [1_000_000n],                       // (initialSupply)
    [],                                 // ()
  ];

  let lastErr: unknown = new Error("No matching constructor");
  for (const args of candidates) {
    try {
      const token = (await F.deploy(...args)) as ExampleToken;
      return token;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Picks a safe transfer amount based on a balance. */
function pickAmount(balance: bigint, prefer: bigint = 1_000n): bigint {
  if (balance <= 1n) return 1n;
  const cap = balance / 10n; // keep <=10% of balance
  const chosen = prefer < cap ? prefer : cap;
  return chosen > 0n ? chosen : 1n;
}

describe("ExampleToken — core behavior", () => {
  let token: ExampleToken;
  let deployer: any, alice: any, bob: any;

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    token = await deployToken();

    // Ensure deployer has some balance (if the contract exposes mint()).
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
    const from = await deployer.getAddress();
    const to = await alice.getAddress();
    const fromBal = await token.balanceOf(from);
    const amount = pickAmount(fromBal, 1_000n);

    await expect(token.transfer(to, amount))
      .to.emit(token, "Transfer")
      .withArgs(from, to, amount);

    expect(await token.balanceOf(to)).to.equal(amount);
  });

  it("transfer 0 works and emits", async () => {
    const to = await alice.getAddress();
    await expect(token.transfer(to, 0n))
      .to.emit(token, "Transfer")
      .withArgs(await deployer.getAddress(), to, 0n);
  });

  it("self-transfer keeps net balance the same and emits", async () => {
    const me = await deployer.getAddress();
    const before = await token.balanceOf(me);
    const amount = pickAmount(before, 10n);

    await expect(token.transfer(me, amount))
      .to.emit(token, "Transfer")
      .withArgs(me, me, amount);

    const after = await token.balanceOf(me);
    expect(after).to.equal(before);
  });

  it("reverts when transferring more than balance", async () => {
    const a = await alice.getAddress();
    const b = await bob.getAddress();

    const aBal = await token.balanceOf(a);
    const amount = aBal + 1n;

    await expect(token.connect(alice).transfer(b, amount)).to.be.reverted;
  });

  it("reverts when transferring to the zero address", async () => {
    const from = await deployer.getAddress();
    const fromBal = await token.balanceOf(from);
    const amount = pickAmount(fromBal, 1n);
    await expect(token.transfer(ethers.ZeroAddress, amount)).to.be.reverted;
  });

  it("approve sets allowance and emits Approval", async () => {
    const spender = await alice.getAddress();
    const amount = 5_000n;

    await expect(token.approve(spender, amount))
      .to.emit(token, "Approval")
      .withArgs(await deployer.getAddress(), spender, amount);

    expect(await token.allowance(await deployer.getAddress(), spender)).to.equal(
      amount
    );
  });

  it("transferFrom consumes allowance and moves funds", async () => {
    const owner = await deployer.getAddress();
    const spender = await alice.getAddress();
    const to = await bob.getAddress();

    const ownerBal = await token.balanceOf(owner);
    const amount = pickAmount(ownerBal, 777n);

    await token.approve(spender, amount);

    await expect(token.connect(alice).transferFrom(owner, to, amount))
      .to.emit(token, "Transfer")
      .withArgs(owner, to, amount);

    expect(await token.allowance(owner, spender)).to.equal(0n);
    expect(await token.balanceOf(to)).to.equal(amount);
  });

  it("approve overwrite OR zero-first pattern (both accepted)", async () => {
    const spender = await alice.getAddress();

    await token.approve(spender, 10n);

    let overwriteWorked = true;
    try {
      await token.approve(spender, 1n);
    } catch {
      overwriteWorked = false;
    }

    if (!overwriteWorked) {
      await token.approve(spender, 0n);
      await token.approve(spender, 1n);
    }

    expect(await token.allowance(await deployer.getAddress(), spender)).to.equal(
      1n
    );
  });

  it("logs include Transfer event (topic parsing smoke test)", async () => {
    const from = await deployer.getAddress();
    const fromBal = await token.balanceOf(from);
    const amount = pickAmount(fromBal, 42n);

    await token.transfer(await alice.getAddress(), amount);
    const tx = await token
      .connect(alice)
      .transfer(await bob.getAddress(), amount);
    const rc = await tx.wait();

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
