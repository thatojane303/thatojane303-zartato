const hre = require("hardhat");

/**
 * Full deploy + optional price request flow.
 * Requires FUNCTIONS_ROUTER and (optionally) SUBSCRIPTION_ID in .env.
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🔑  Deploying with:", deployer.address);

  const FUNCTIONS_ROUTER =
    process.env.FUNCTIONS_ROUTER || "0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715";
  const SUBSCRIPTION_ID = process.env.SUBSCRIPTION_ID || "0";

  const Token = await hre.ethers.getContractFactory("ZarTATO");
  const token = await Token.deploy(deployer.address);
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("ZarTATO:", tokenAddr);

  const Oracle = await hre.ethers.getContractFactory("ZarTATOOracle");
  const oracle = await Oracle.deploy(deployer.address, FUNCTIONS_ROUTER);
  await oracle.waitForDeployment();
  const oracleAddr = await oracle.getAddress();
  console.log("ZarTATOOracle:", oracleAddr);

  await (await token.setOracle(oracleAddr)).wait();
  await (await token.updateReserves(1000)).wait();

  if (SUBSCRIPTION_ID && SUBSCRIPTION_ID !== "0") {
    await (await oracle.setSubscriptionId(BigInt(SUBSCRIPTION_ID))).wait();
    console.log("Subscription ID set:", SUBSCRIPTION_ID);
  }

  // Seed price; replace with live Chainlink Functions response in production
  await (await oracle.setPrice(4500)).wait();
  const reqId = await oracle.requestPriceUpdate.staticCall();
  await (await oracle.requestPriceUpdate()).wait();
  console.log("Price request recorded:", reqId);

  console.log("\nDeployment summary");
  console.log("  Token: ", tokenAddr);
  console.log("  Oracle:", oracleAddr);
  console.log("  Next: fund Chainlink subscription, add oracle as consumer,");
  console.log("        then fulfill via Functions or oracle.setPrice()");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
