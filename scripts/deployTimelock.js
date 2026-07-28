const hre = require("hardhat");

async function main() {
    const LP_TOKEN_ADDRESS = "0x..."; // UPDATE AFTER ADDING LIQUIDITY
    const LOCK_DURATION = 365 * 24 * 60 * 60; // 1 year

    const Timelock = await hre.ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(
        LP_TOKEN_ADDRESS,
        deployer.address,
        Math.floor(Date.now() / 1000) + LOCK_DURATION
    );
    await timelock.waitForDeployment();
}
