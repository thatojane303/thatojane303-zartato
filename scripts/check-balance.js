const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer is configured. Set PRIVATE_KEY before checking a remote deployment wallet.");
  }

  const address = await deployer.getAddress();
  const balance = await hre.ethers.provider.getBalance(address);
  const network = await hre.ethers.provider.getNetwork();

  console.log("Wallet:", address);
  console.log("Network:", hre.network.name, "(chain", network.chainId.toString() + ")");
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
