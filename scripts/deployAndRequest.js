/**
 * @deprecated This script was for BSC RWA model with oracle.
 * 
 * For Base fixed-supply model, use:
 *   npx hardhat run scripts/deploy.js --network baseSepolia
 *   npx hardhat verify --network baseSepolia <TOKEN_ADDRESS>
 */

const hre = require("hardhat");

async function main() {
  console.log("⚠️  This script is deprecated for Base fixed-supply model.");
  console.log("\n✅ For Base Sepolia testnet:");
  console.log("   npx hardhat run scripts/deploy.js --network baseSepolia");
  console.log("\n✅ For verification on BaseScan:");
  console.log("   npx hardhat verify --network baseSepolia <TOKEN_ADDRESS>");
  console.log("\n📚 Read DEPLOYMENT.md for full Base deployment guide.\n");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
