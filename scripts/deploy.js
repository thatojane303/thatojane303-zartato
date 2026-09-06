const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑  Deploying with:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰  Balance:", hre.ethers.formatEther(balance), hre.network.name === 'bsctestnet' ? 'BNB' : 'ETH');

  const FUNCTIONS_ROUTER =
    process.env.FUNCTIONS_ROUTER || "0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715";

  console.log("\n📦  Deploying ZarTATO token...");
  const Token = await hre.ethers.getContractFactory("ZarTATO");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("✅  ZarTATO deployed to:", tokenAddr);

  console.log("\n📡  Deploying ZarTATOOracle...");
  const Oracle = await hre.ethers.getContractFactory("ZarTATOOracle");
  const oracle = await Oracle.deploy(deployer.address, FUNCTIONS_ROUTER);
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  console.log("✅  ZarTATOOracle deployed to:", oracleAddr);

  console.log("\n🔗  Linking oracle to token...");
  await (await token.setOracle(oracleAddr)).wait();
  console.log("✅  Oracle linked");

  console.log("\n📊  Setting initial reserves (1000 bags)...");
  await (await token.updateReserves(1000)).wait();
  console.log("✅  Initial reserves set");

  // Seed a demo price so getPrice works immediately on testnet
  console.log("\n🥔  Setting initial price (4500 ZAR cents = R45.00)...");
  await (await oracle.setPrice(4500)).wait();
  console.log("✅  Initial price set");

  console.log("\n============================================================");
  console.log("  ZarTATO Deployment Complete 🥔");
  console.log("============================================================");
  console.log("  Token Address:  ", tokenAddr);
  console.log("  Oracle Address: ", oracleAddr);
  console.log("  Deployer:       ", deployer.address);
  console.log("  Network:        ", hre.network.name);
  console.log("============================================================");

  // write deployment info to file for CI or later use
  const out = {
    token: tokenAddr,
    oracle: oracleAddr,
    deployer: deployer.address,
    network: hre.network.name,
    functionsRouter: FUNCTIONS_ROUTER,
  };

  try {
    fs.writeFileSync("deployment.json", JSON.stringify(out, null, 2));
    console.log("deployment.json written");
  } catch (err) {
    console.warn("Could not write deployment.json:", err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
