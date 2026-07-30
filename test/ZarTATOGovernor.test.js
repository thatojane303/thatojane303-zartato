const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("ZarTATO Governance", function () {
  let token, oracle, timelock, governor;
  let owner, alice, bob, carol;

  const ONE = 10n ** 18n;
  const VOTING_DELAY = 1; // blocks
  const VOTING_PERIOD = 5; // blocks
  const PROPOSAL_THRESHOLD = 0n; // allow any holder for tests
  const QUORUM_BPS = 1000; // 10%
  const TIMELOCK_DELAY = 3600; // 1 hour

  beforeEach(async function () {
    [owner, alice, bob, carol] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ZarTATO");
    token = await Token.deploy(owner.address);
    await token.waitForDeployment();

    const Oracle = await ethers.getContractFactory("ZarTATOOracle");
    oracle = await Oracle.deploy(owner.address, ethers.ZeroAddress);
    await oracle.waitForDeployment();

    await token.setOracle(await oracle.getAddress());
    await token.updateReserves(10_000);
    // Distribute voting power
    await token.mint(alice.address, 600n * ONE); // 60%
    await token.mint(bob.address, 300n * ONE);   // 30%
    await token.mint(carol.address, 100n * ONE); // 10%

    // Deploy timelock with temporary admin = owner, then hand to governor
    const Timelock = await ethers.getContractFactory("ZarTATOTimelock");
    timelock = await Timelock.deploy(owner.address, TIMELOCK_DELAY);
    await timelock.waitForDeployment();

    const Governor = await ethers.getContractFactory("ZarTATOGovernor");
    governor = await Governor.deploy(
      await token.getAddress(),
      await timelock.getAddress(),
      VOTING_DELAY,
      VOTING_PERIOD,
      PROPOSAL_THRESHOLD,
      QUORUM_BPS
    );
    await governor.waitForDeployment();

    await timelock.setAdmin(await governor.getAddress());
    // Hand token ownership to timelock so proposals can call onlyOwner functions
    await token.transferOwnership(await timelock.getAddress());
  });

  async function proposeUpdateReserves(newBags) {
    const data = token.interface.encodeFunctionData("updateReserves", [newBags]);
    const tx = await governor.connect(alice).propose(
      [await token.getAddress()],
      [0],
      [data],
      "Increase reserves to " + newBags
    );
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((l) => {
        try {
          return governor.interface.parseLog(l);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "ProposalCreated");
    return event.args.proposalId;
  }

  it("should create a proposal when threshold met", async function () {
    const id = await proposeUpdateReserves(20_000);
    expect(id).to.equal(1n);
    expect(await governor.state(id)).to.equal(0n); // Pending
  });

  it("should accept votes while Active and pass with quorum", async function () {
    const id = await proposeUpdateReserves(20_000);
    await mine(VOTING_DELAY + 1);
    expect(await governor.state(id)).to.equal(1n); // Active

    await governor.connect(alice).castVote(id, 1); // For
    await governor.connect(bob).castVote(id, 1);

    await mine(VOTING_PERIOD + 1);
    expect(await governor.state(id)).to.equal(4n); // Succeeded
  });

  it("should defeat proposal if against wins", async function () {
    const id = await proposeUpdateReserves(1);
    await mine(VOTING_DELAY + 1);
    await governor.connect(alice).castVote(id, 0); // Against 60%
    await governor.connect(bob).castVote(id, 1);   // For 30%
    await mine(VOTING_PERIOD + 1);
    expect(await governor.state(id)).to.equal(3n); // Defeated
  });

  it("should queue and execute after timelock delay", async function () {
    const id = await proposeUpdateReserves(20_000);
    await mine(VOTING_DELAY + 1);
    await governor.connect(alice).castVote(id, 1);
    await governor.connect(bob).castVote(id, 1);
    await mine(VOTING_PERIOD + 1);

    await governor.queue(id);
    expect(await governor.state(id)).to.equal(5n); // Queued

    await time.increase(TIMELOCK_DELAY + 1);
    await governor.execute(id);

    expect(await governor.state(id)).to.equal(7n); // Executed
    expect(await token.reserveBags()).to.equal(20_000n);
    expect(await token.owner()).to.equal(await timelock.getAddress());
  });

  it("should not allow double voting", async function () {
    const id = await proposeUpdateReserves(5000);
    await mine(VOTING_DELAY + 1);
    await governor.connect(alice).castVote(id, 1);
    await expect(governor.connect(alice).castVote(id, 1)).to.be.revertedWith(
      "Gov: already voted"
    );
  });

  it("should allow proposer to cancel before queue", async function () {
    const id = await proposeUpdateReserves(999);
    await governor.connect(alice).cancel(id);
    expect(await governor.state(id)).to.equal(2n); // Canceled
  });
});
