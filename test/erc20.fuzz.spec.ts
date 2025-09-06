// test/erc20.fuzz.spec.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import * as fc from "fast-check";
import type { ExampleToken } from "../typechain-types";

async function deployTokenForFuzz(): Promise<ExampleToken> {
  const Factory = await ethers.getContractFactory("ExampleToken");
  const F = Factory as any;

  let token: ExampleToken;
  try {
    token = (await F.deploy()) as ExampleToken; // 0-arg constructor
  } catch {
    token = (await F.deploy("ExampleToken", "EXT")) as ExampleToken; // (name, symbol)
  }
  return token;
}

describe("ExampleToken — fuzzed transfers", () => {
  let token: ExampleToken;
  let deployer: any, a1: any, a2: any;

  beforeEach(async () => {
    [deployer, a1, a2] = await ethers.getSigners();
    token = await deployTokenForFuzz();

    // Ensure deployer has a starting balance
    const tAny = token as any;
    const me = await deployer.getAddress();
    const bal = await token.balanceOf(me);
    if (bal === 0n && tAny.mint) {
      await tAny.mint(me, 100_000n); // raw units
    } else {
      expect(await token.balanceOf(me)).to.be.gt(0n);
    }
  });

  it("random valid transfers conserve total supply", async () => {
    const totalBefore = await token.totalSupply();

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 50 }), // up to 50 steps
        async (steps) => {
          for (let i = 0; i < steps; i++) {
            const from = i % 2 === 0 ? deployer : a1;
            const to = i % 3 === 0 ? a1 : a2;

            const fromBal = await token.balanceOf(await from.getAddress());
            if (fromBal === 0n) continue;

            const raw = fc.sample(fc.integer({ min: 1, max: 1000 }), 1)[0];
            const amount = (BigInt(raw) % fromBal) + 1n;

            await token.connect(from).transfer(await to.getAddress(), amount);

            expect(await token.totalSupply()).to.equal(totalBefore);
          }
        }
      ),
      { numRuns: 10 }
    );
  });
});
