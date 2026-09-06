const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("\n📋 Wallet Balance Check");
  console.log("========================");
  console.log(`Wallet: ${deployer.address}`);
  console.log(`Balance: ${hre.ethers.formatEther(bal)} tBNB`);
  
  if (bal < hre.ethers.parseEther("0.02")) {
    console.log("\n❌ Insufficient balance for deployment!");
    console.log("   Need at least 0.02 tBNB to cover gas fees");
    console.log("   Get test BNB: https://testnet.bnbchain.org/faucet-smart/");
    process.exitCode = 1;
  } else {
    console.log("\n✅ Sufficient balance to deploy!");
  }
  console.log("========================\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
