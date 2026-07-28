const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ZarTATO Full Suite", function () {
    let token, multisig, s1, s2, s3, s4, user, owner;

    beforeEach(async function () {
        [owner, s1, s2, s3, s4, user] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("ZarTATO_Tax");
        token = await Token.deploy();
        await token.waitForDeployment?.();

        const MultiSig = await ethers.getContractFactory("ZarTATO_MultiSig");
        multisig = await MultiSig.deploy(
            [owner.address, s1.address, s2.address, s3.address, s4.address],
            3
        );
        await multisig.waitForDeployment?.();

        await token.transferOwnership(await multisig.getAddress());
    });

    it("Should charge buy fee", async function () {
        await token.enableTrading();
        // test buy fee logic
    });
});
