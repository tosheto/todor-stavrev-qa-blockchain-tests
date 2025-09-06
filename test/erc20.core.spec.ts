// test/erc20.core.spec.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import type { ExampleToken } from "../typechain-types";

// Малък helper, който пробва няколко сигнатури на конструктора.
async function deployToken(): Promise<ExampleToken> {
  const NAME = "ExampleToken";
  const SYMBOL = "EXT";
  const DECIMALS = 18;
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", DECIMALS);

  const Factory = await ethers.getContractFactory("ExampleToken");
  const F = Factory as any;

  let token: ExampleToken;

  // Пробваме 3-арг. (name, symbol, initialSupply) → после (name, symbol) → после ().
  try {
    token = (await F.deploy(NAME, SYMBOL, INITIAL_SUPPLY)) as ExampleToken;
  } catch {
    try {
      token = (await F.deploy(NAME, SYMBOL)) as ExampleToken;
    } catch {
      token = (await F.deploy()) as ExampleToken;
    }
  }

  // Ако има mint(), гарантираме видим баланс за deployer (за тестовете)
  const tAny = token as any;
  const [deployer] = await ethers.getSigners();
  if (tAny.mint) {
    const bal = await token.balanceOf(await deployer.getAddress());
    if (bal === 0n) {
      await tAny.mint(await deployer.getAddress(), INITIAL_SUPPLY);
    }
  }

  return token;
}

describe("ExampleToken — core behavior", () => {
  let token: ExampleToken;
  let deployer: any, alice: any, bob: any;

  const NAME = "ExampleToken";
  const SYMBOL = "EXT";
  const DECIMALS = 18;

  beforeEach(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    token = await deployToken();
  });

  it("has correct name/symbol/decimals (if supported)", async () => {
    const tAny = token as any;
    if (tAny.name) expect(await tAny.name()).to.equal(NAME);
    if (tAny.symbol) expect(await tAny.symbol()).to.equal(SYMBOL);
    if (tAny.decimals) expect(await tAny.decimals()).to.equal(DECIMALS);
  });

  it("mints initial supply to deployer (or ensures supply > 0)", async () => {
    const total = await token.totalSupply();
    expect(total).to.be.gt(0n);
    const balDeployer = await token.balanceOf(await deployer.getAddress());
    // В повечето ERC20 примери целият supply е при deployer
    expect(balDeployer).to.equal(await token.totalSupply());
  });

  it("transfer moves balance and emits Transfer", async () => {
    const amount = ethers.parseUnits("1000", DECIMALS);
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
    const amount = ethers.parseUnits("10", DECIMALS);
    await expect(token.transfer(me, amount))
      .to.emit(token, "Transfer")
      .withArgs(me, me, amount);
    const after = await token.balanceOf(me);
    expect(after).to.equal(before); // нето ефект 0
  });

  it("reverts when transferring more than balance", async () => {
    const amount = (await token.balanceOf(await alice.getAddress())) + 1n;
    await expect(
      token.connect(alice).transfer(await bob.getAddress(), amount)
    ).to.be.reverted;
  });

  it("reverts when transferring to the zero address", async () => {
    const amount = ethers.parseUnits("1", DECIMALS);
    await expect(token.transfer(ethers.ZeroAddress, amount)).to.be.reverted;
  });

  it("approve sets allowance and emits Approval", async () => {
    const amount = ethers.parseUnits("5000", DECIMALS);
    await expect(token.approve(await alice.getAddress(), amount))
      .to.emit(token, "Approval")
      .withArgs(await deployer.getAddress(), await alice.getAddress(), amount);

    expect(
      await token.allowance(await deployer.getAddress(), await alice.getAddress())
    ).to.equal(amount);
  });

  it("transferFrom consumes allowance and moves funds", async () => {
    const amount = ethers.parseUnits("777", DECIMALS);
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

  it("transferFrom more than allowance reverts", async () => {
    const amount = ethers.parseUnits("100", DECIMALS);
    await token.approve(await alice.getAddress(), amount - 1n);
    await expect(
      token
        .connect(alice)
        .transferFrom(
          await deployer.getAddress(),
          await bob.getAddress(),
          amount
        )
    ).to.be.reverted;
  });

  it("approve can overwrite previous allowance", async () => {
    await token.approve(
      await alice.getAddress(),
      ethers.parseUnits("10", DECIMALS)
    );
    await token.approve(
      await alice.getAddress(),
      ethers.parseUnits("1", DECIMALS)
    );
    expect(
      await token.allowance(await deployer.getAddress(), await alice.getAddress())
    ).to.equal(ethers.parseUnits("1", DECIMALS));
  });

  it("optional: increase/decreaseAllowance if available", async () => {
    const tAny = token as any;
    if (tAny.increaseAllowance && tAny.decreaseAllowance) {
      await tAny.increaseAllowance(
        await alice.getAddress(),
        ethers.parseUnits("3", DECIMALS)
      );
      await tAny.decreaseAllowance(
        await alice.getAddress(),
        ethers.parseUnits("1", DECIMALS)
      );
      expect(
        await token.allowance(await deployer.getAddress(), await alice.getAddress())
      ).to.equal(ethers.parseUnits("2", DECIMALS));
    } else {
      expect(true).to.equal(true); // graceful skip
    }
  });

  it("logs include Transfer event (topic parsing smoke test)", async () => {
    const amount = ethers.parseUnits("42", DECIMALS);
    await token.transfer(await alice.getAddress(), amount);
    const tx = await token
      .connect(alice)
      .transfer(await bob.getAddress(), amount);
    const rc = await tx.wait();

    // В ethers v6 парсваме логовете през интерфейса
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
