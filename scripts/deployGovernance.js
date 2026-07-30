const hre = require("hardhat");

/**
 * Deploys Timelock + Governor and optionally wires them to an existing ZarTATO token.
 *
 * Env (optional):
 *   TOKEN_ADDR   – existing ZarTATO address (if omitted, deploys a new token+oracle)
 *   TIMELOCK_DELAY – seconds (default 86400 = 1 day)
 *   VOTING_DELAY – blocks (default 1)
 *   VOTING_PERIOD – blocks (default 50400 ~ 1.75 days on BSC ~3s blocks → tune for your network)
 *   PROPOSAL_THRESHOLD – wei (default 0)
 *   QUORUM_BPS – default 1000 (10%)
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const TIMELOCK_DELAY = Number(process.env.TIMELOCK_DELAY || 86400);
  const VOTING_DELAY = Number(process.env.VOTING_DELAY || 1);
  const VOTING_PERIOD = Number(process.env.VOTING_PERIOD || 28800); // ~1 day @ 3s blocks
  const PROPOSAL_THRESHOLD = BigInt(process.env.PROPOSAL_THRESHOLD || "0");
  const QUORUM_BPS = Number(process.env.QUORUM_BPS || 1000);

  let tokenAddr = process.env.TOKEN_ADDR;
  let oracleAddr = process.env.ORACLE_ADDR;

  if (!tokenAddr) {
    console.log("No TOKEN_ADDR — deploying fresh ZarTATO + Oracle...");
    const Token = await hre.ethers.getContractFactory("ZarTATO");
    const token = await Token.deploy(deployer.address);
    await token.waitForDeployment();
    tokenAddr = await token.getAddress();

    const router =
      process.env.FUNCTIONS_ROUTER || "0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715";
    const Oracle = await hre.ethers.getContractFactory("ZarTATOOracle");
    const oracle = await Oracle.deploy(deployer.address, router);
    await oracle.waitForDeployment();
    oracleAddr = await oracle.getAddress();

    await (await token.setOracle(oracleAddr)).wait();
    await (await token.updateReserves(1000)).wait();
    await (await oracle.setPrice(4500)).wait();
    console.log("Token:", tokenAddr);
    console.log("Oracle:", oracleAddr);
  }

  console.log("Deploying Timelock (admin = deployer temporarily)...");
  const Timelock = await hre.ethers.getContractFactory("ZarTATOTimelock");
  const timelock = await Timelock.deploy(deployer.address, TIMELOCK_DELAY);
  await timelock.waitForDeployment();
  const timelockAddr = await timelock.getAddress();
  console.log("Timelock:", timelockAddr);

  console.log("Deploying Governor...");
  const Governor = await hre.ethers.getContractFactory("ZarTATOGovernor");
  const governor = await Governor.deploy(
    tokenAddr,
    timelockAddr,
    VOTING_DELAY,
    VOTING_PERIOD,
    PROPOSAL_THRESHOLD,
    QUORUM_BPS
  );
  await governor.waitForDeployment();
  const governorAddr = await governor.getAddress();
  console.log("Governor:", governorAddr);

  console.log("Setting Timelock admin → Governor...");
  await (await timelock.setAdmin(governorAddr)).wait();

  const token = await hre.ethers.getContractAt("ZarTATO", tokenAddr);
  const currentOwner = await token.owner();
  if (currentOwner.toLowerCase() === deployer.address.toLowerCase()) {
    console.log("Transferring ZarTATO ownership → Timelock...");
    await (await token.transferOwnership(timelockAddr)).wait();
  } else {
    console.log(
      "Token owner is", currentOwner,
      "— transfer ownership to Timelock via multi-sig/owner when ready."
    );
  }

  if (oracleAddr) {
    const oracle = await hre.ethers.getContractAt("ZarTATOOracle", oracleAddr);
    try {
      const oOwner = await oracle.owner();
      if (oOwner.toLowerCase() === deployer.address.toLowerCase()) {
        console.log("Transferring Oracle ownership → Timelock...");
        await (await oracle.transferOwnership(timelockAddr)).wait();
      }
    } catch (_) {
      /* ignore */
    }
  }

  console.log("\n========== Governance Deployment Complete ==========");
  console.log("Token:    ", tokenAddr);
  console.log("Timelock:", timelockAddr);
  console.log("Governor:", governorAddr);
  console.log("Delay:   ", TIMELOCK_DELAY, "seconds");
  console.log("Quorum:  ", QUORUM_BPS / 100, "%");
  console.log("===================================================");
  console.log("Next: holders propose via governor.propose(targets, values, calldatas, desc)");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
