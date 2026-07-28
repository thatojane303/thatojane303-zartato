const hre = require("hardhat");

async function main() {
    const LP_TOKEN_ADDRESS = "0x..."; // UPDATE AFTER ADDING LIQUIDITY
    const LOCK_DURATION = 365 * 24 * 60 * 60; // 1 year
    const [deployer] = await hre.ethers.getSigners();

    const Timelock = await hre.ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(
        LP_TOKEN_ADDRESS,
        deployer.address,
        Math.floor(Date.now() / 1000) + LOCK_DURATION
    );
    if (timelock.waitForDeployment) {
        await timelock.waitForDeployment();
    } else {
        await timelock.deployed();
    }
    console.log("Timelock deployed to:", timelock.address);
}

// run with: npx hardhat run scripts/deployTimelock.js --network <network>
main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
