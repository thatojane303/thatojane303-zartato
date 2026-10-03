const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑 Deploying with:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH on", hre.network.name);

  console.log("\n📦 Deploying ZarTATO (fixed-supply ERC-20)...");
  const Token = await hre.ethers.getContractFactory("ZarTATO");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("✅ ZarTATO deployed to:", tokenAddr);

  // Verify supply
  const totalSupply = await token.totalSupply();
  console.log("📊 Total supply:", hre.ethers.formatEther(totalSupply), "ZRT");

  // Check deployer balance (should have full supply)
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log("💎 Deployer balance:", hre.ethers.formatEther(deployerBalance), "ZRT");

  console.log("\n============================================================");
  console.log(" ZarTATO Deployment Complete 🥔");
  console.log("============================================================");
  console.log(" Token Address:  ", tokenAddr);
  console.log(" Deployer:       ", deployer.address);
  console.log(" Network:        ", hre.network.name);
  console.log(" Chain ID:       ", (await hre.ethers.provider.getNetwork()).chainId);
  console.log(" Total Supply:   ", hre.ethers.formatEther(totalSupply), "ZRT");
  console.log("============================================================");
  console.log(" Next steps:");
  console.log(" 1. Transfer tokens to Aerodrome LP pool (40% locked 12mo)");
  console.log(" 2. Reserve 15% for team vesting (Sablier)");
  console.log(" 3. Verify on BaseScan: npx hardhat verify --network baseSepolia <TOKEN_ADDR>");
  console.log("============================================================\n");

  // Write deployment info to file for CI or later use
  const out = {
    token: tokenAddr,
    deployer: deployer.address,
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    totalSupply: totalSupply.toString(),
    timestamp: new Date().toISOString(),
  };

  try {
    fs.writeFileSync("deployment.json", JSON.stringify(out, null, 2));
    console.log("✅ deployment.json written");
  } catch (err) {
    console.warn("⚠️  Could not write deployment.json:", err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
