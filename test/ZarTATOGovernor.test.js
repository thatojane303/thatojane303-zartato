/**
 * @deprecated Governance tests were for BSC RWA model with minting/burning.
 * 
 * For Base fixed-supply model:
 * - No minting/burning, so governance over reserves not needed
 * - Owner (timelock) can manage token ownership if needed
 * - For future governance: implement separate Governor contract
 * 
 * Current test suite: see test/ZarTATO.test.js
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZarTATO Governance (Future Enhancement)", function () {
  let token;
  let owner, user1;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ZarTATO");
    token = await Token.deploy();
    await token.waitForDeployment();
  });

  describe("Ownership", function () {
    it("should have owner at deployment", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("should allow owner to transfer ownership", async function () {
      await token.transferOwnership(user1.address);
      expect(await token.owner()).to.equal(user1.address);
    });

    it("should revert if non-owner tries to transfer", async function () {
      await expect(
        token.connect(user1).transferOwnership(user1.address)
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("should revert transfer to zero address", async function () {
      await expect(
        token.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(token, "OwnableInvalidOwner");
    });
  });

  describe("Future Governance Notes", function () {
    it("placeholder: no minting/burning to vote on", async function () {
      // Fixed-supply token: no need to vote on mint/burn
      // Governance can be added for future features (e.g., pausable, upgradeable)
      expect(true).to.equal(true);
    });
  });
});
