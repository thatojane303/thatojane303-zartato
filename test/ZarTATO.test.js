const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZarTATO ERC-20 Fixed Supply", function () {
  let token;
  let owner, addr1, addr2;

  const FIXED_SUPPLY = ethers.parseUnits("1000000000", 18); // 1B tokens

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ZarTATO");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should have correct name", async function () {
      expect(await token.name()).to.equal("ZarTATO");
    });

    it("should have correct symbol", async function () {
      expect(await token.symbol()).to.equal("ZRT");
    });

    it("should have 18 decimals", async function () {
      expect(await token.decimals()).to.equal(18);
    });

    it("should have 1B total supply", async function () {
      expect(await token.totalSupply()).to.equal(FIXED_SUPPLY);
    });

    it("should mint full supply to deployer", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(FIXED_SUPPLY);
    });
  });

  describe("ERC-20 Standard Functions", function () {
    it("should transfer tokens", async function () {
      const amount = ethers.parseUnits("100", 18);
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
      expect(await token.balanceOf(owner.address)).to.equal(FIXED_SUPPLY - amount);
    });

    it("should approve and transferFrom", async function () {
      const amount = ethers.parseUnits("100", 18);
      await token.approve(addr1.address, amount);
      expect(await token.allowance(owner.address, addr1.address)).to.equal(amount);

      await token.connect(addr1).transferFrom(owner.address, addr2.address, amount);
      expect(await token.balanceOf(addr2.address)).to.equal(amount);
    });

    it("should emit Transfer event", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(token.transfer(addr1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, amount);
    });

    it("should emit Approval event", async function () {
      const amount = ethers.parseUnits("100", 18);
      await expect(token.approve(addr1.address, amount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, addr1.address, amount);
    });
  });

  describe("Fixed Supply Immutability", function () {
    it("should prevent minting", async function () {
      const amount = ethers.parseUnits("1", 18);
      await expect(token.mint(addr1.address, amount))
        .to.be.revertedWith("ZarTATO: minting disabled - fixed supply");
    });

    it("should prevent burning", async function () {
      // Transfer some tokens first
      const amount = ethers.parseUnits("100", 18);
      await token.transfer(addr1.address, amount);

      // Try to burn
      await expect(token.connect(addr1).burn(amount))
        .to.be.revertedWith("ZarTATO: burning disabled - fixed supply");
    });

    it("should prevent burnFrom", async function () {
      const amount = ethers.parseUnits("100", 18);
      await token.transfer(addr1.address, amount);
      await token.connect(addr1).approve(owner.address, amount);

      await expect(token.burnFrom(addr1.address, amount))
        .to.be.revertedWith("ZarTATO: burning disabled - fixed supply");
    });

    it("total supply should remain constant", async function () {
      const initialSupply = await token.totalSupply();
      
      // Transfer around
      const amount = ethers.parseUnits("1000000", 18);
      await token.transfer(addr1.address, amount);
      await token.connect(addr1).transfer(addr2.address, amount / 2n);

      // Supply should not change
      expect(await token.totalSupply()).to.equal(initialSupply);
    });
  });

  describe("Access Control", function () {
    it("should allow only owner to call mint (reverted)", async function () {
      const amount = ethers.parseUnits("1", 18);
      await expect(token.connect(addr1).mint(addr1.address, amount))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should have owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Multiple Transfers", function () {
    it("should handle multiple transfers correctly", async function () {
      const amount1 = ethers.parseUnits("1000000", 18);
      const amount2 = ethers.parseUnits("500000", 18);

      await token.transfer(addr1.address, amount1);
      await token.transfer(addr2.address, amount2);

      expect(await token.balanceOf(addr1.address)).to.equal(amount1);
      expect(await token.balanceOf(addr2.address)).to.equal(amount2);
      expect(await token.balanceOf(owner.address)).to.equal(
        FIXED_SUPPLY - amount1 - amount2
      );
    });

    it("should handle circular transfers", async function () {
      const amount = ethers.parseUnits("100", 18);

      // owner → addr1
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);

      // addr1 → addr2
      await token.connect(addr1).transfer(addr2.address, amount);
      expect(await token.balanceOf(addr2.address)).to.equal(amount);

      // addr2 → owner
      await token.connect(addr2).transfer(owner.address, amount);
      expect(await token.balanceOf(owner.address)).to.equal(FIXED_SUPPLY);
    });
  });
});
