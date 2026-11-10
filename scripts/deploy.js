const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer is configured. Set PRIVATE_KEY locally or in the manual Base Sepolia workflow.");
  }

  const deployerAddress = await deployer.getAddress();
  console.log("Deploying with:", deployerAddress);
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH on", hre.network.name);

  console.log("\nDeploying ZarTATO fixed-supply ERC-20...");
  const Token = await hre.ethers.getContractFactory("ZarTATO");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddr = await token.getAddress();
  console.log("ZarTATO deployed to:", tokenAddr);

  const totalSupply = await token.totalSupply();
  const deployerBalance = await token.balanceOf(deployerAddress);
  const network = await hre.ethers.provider.getNetwork();

  console.log("\nDeployment summary");
  console.log("Token address:", tokenAddr);
  console.log("Deployer:", deployerAddress);
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Total supply:", hre.ethers.formatEther(totalSupply), "ZRT");
  console.log("Deployer balance:", hre.ethers.formatEther(deployerBalance), "ZRT");
  console.log("\nNext steps: verify the testnet contract on BaseScan and update the deployment record only after confirming the address.");
  console.log("This deployment does not create a liquidity pool, lock LP tokens, vest team tokens, or provide a market-price feed.");

  const out = {
    token: tokenAddr,
    deployer: deployerAddress,
    network: hre.network.name,
    chainId: Number(network.chainId),
    totalSupply: totalSupply.toString(),
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync("deployment.json", JSON.stringify(out, null, 2));
  console.log("Local deployment.json written (ignored by git).");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
