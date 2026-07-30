const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZarTATO Full Suite", function () {
  let token, oracle, mockRouter, multisig;
  let owner, s1, s2, s3, user;

  const INITIAL_RESERVES = 1000n; // bags
  const ONE = 10n ** 18n;

  beforeEach(async function () {
    [owner, s1, s2, s3, user] = await ethers.getSigners();

    const MockRouter = await ethers.getContractFactory("MockFunctionsRouter");
    mockRouter = await MockRouter.deploy();
    await mockRouter.waitForDeployment();

    const Oracle = await ethers.getContractFactory("ZarTATOOracle");
    oracle = await Oracle.deploy(owner.address, await mockRouter.getAddress());
    await oracle.waitForDeployment();

    const Token = await ethers.getContractFactory("ZarTATO");
    token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    await token.setOracle(await oracle.getAddress());
    await token.updateReserves(INITIAL_RESERVES);

    const MultiSig = await ethers.getContractFactory("ZarTATO_MultiSig");
    multisig = await MultiSig.deploy(
      [owner.address, s1.address, s2.address, s3.address],
      3
    );
    await multisig.waitForDeployment();
  });

  describe("Reserve Constraints", function () {
    it("Should not mint more than reserves", async function () {
      const over = (INITIAL_RESERVES + 1n) * ONE;
      await expect(token.mint(user.address, over)).to.be.revertedWith(
        "ZarTATO: exceeds reserves"
      );
    });

    it("Should allow minting within reserves", async function () {
      const amount = 100n * ONE;
      await token.mint(user.address, amount);
      expect(await token.balanceOf(user.address)).to.equal(amount);
      expect(await token.totalSupply()).to.equal(amount);
    });

    it("Should allow burning and update supply", async function () {
      const amount = 50n * ONE;
      await token.mint(user.address, amount);
      await token.connect(user).burn(20n * ONE);
      expect(await token.balanceOf(user.address)).to.equal(30n * ONE);
      expect(await token.totalSupply()).to.equal(30n * ONE);
    });

    it("Should track 1 ZRT = 1 bag = 10kg capacity", async function () {
      expect(await token.reserveBags()).to.equal(INITIAL_RESERVES);
      expect(await token.remainingMintCapacity()).to.equal(INITIAL_RESERVES * ONE);
      await token.mint(user.address, 10n * ONE);
      expect(await token.remainingMintCapacity()).to.equal(990n * ONE);
    });
  });

  describe("Oracle Integration", function () {
    it("Should revert getPrice if oracle has no price yet", async function () {
      await expect(token.getPrice()).to.be.revertedWith("ZarTATOOracle: no price yet");
    });

    it("Should allow owner to set oracle price", async function () {
      await oracle.setPrice(4500); // e.g. R45.00 in cents
      expect(await token.getPrice()).to.equal(4500);
      expect(await oracle.lastUpdated()).to.be.gt(0);
    });

    it("Should not allow non-owner to set oracle", async function () {
      await expect(oracle.connect(user).setPrice(1000)).to.be.reverted;
    });

    it("Should fulfill via mock router", async function () {
      const reqId = await oracle.requestPriceUpdate.staticCall();
      await oracle.requestPriceUpdate();
      await mockRouter.simulateFulfill(await oracle.getAddress(), reqId, 5200);
      expect(await oracle.getPrice()).to.equal(5200);
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to mint", async function () {
      await expect(token.connect(user).mint(user.address, ONE)).to.be.reverted;
    });

    it("Should only allow owner to update reserves", async function () {
      await expect(token.connect(user).updateReserves(500)).to.be.reverted;
    });

    it("Should only allow owner to set oracle on token", async function () {
      await expect(token.connect(user).setOracle(user.address)).to.be.reverted;
    });
  });

  describe("MultiSig", function () {
    it("Should deploy with correct signers and threshold", async function () {
      expect(await multisig.required()).to.equal(3);
      expect(await multisig.isSigner(owner.address)).to.equal(true);
      expect(await multisig.isSigner(s1.address)).to.equal(true);
      expect(await multisig.isSigner(user.address)).to.equal(false);
    });

    it("Should allow signer to submit a transaction", async function () {
      const data = token.interface.encodeFunctionData("updateReserves", [2000]);
      await expect(
        multisig.submitTransaction(await token.getAddress(), 0, data)
      ).to.emit(multisig, "Submit");
      expect(await multisig.txCount()).to.equal(1);
    });
  });
});
