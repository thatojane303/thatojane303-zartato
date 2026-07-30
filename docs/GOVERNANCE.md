# ZarTATO Governance

Token-holder (ZRT) governance with a timelock between approval and execution.

## Architecture

```
ZRT Holders
    │  propose / vote
    ▼
ZarTATOGovernor
    │  queue / execute
    ▼
ZarTATOTimelock  ──(owns)──►  ZarTATO + ZarTATOOracle
    │
    └── delayed calls: updateReserves, setOracle, setPrice, setGovernanceParams, ...
```

**Ops path (existing):** `ZarTATO_MultiSig` remains available for signer-based control before or alongside full DAO handoff.

## Contracts

| Contract | Role |
|----------|------|
| `ZarTATOGovernor` | Propose, vote, queue, execute |
| `ZarTATOTimelock` | Enforces min delay before execution |
| `ZarTATO` / `ZarTATOOracle` | Targets of successful proposals (owner = Timelock) |

## Parameters (defaults in deploy script)

| Param | Default | Meaning |
|-------|---------|--------|
| `votingDelay` | 1 block | Blocks after propose before voting opens |
| `votingPeriod` | network-dependent | How long voting stays open |
| `proposalThreshold` | 0 | Min ZRT to create a proposal |
| `quorumBps` | 1000 (10%) | Min participating supply (for+abstain) |
| `timelock.delay` | 1 day | Seconds between queue and execute |

## Proposal lifecycle

1. **Propose** — `governor.propose(targets, values, calldatas, description)`
2. **Pending** → **Active** after `votingDelay` blocks
3. **Vote** — `castVote(proposalId, support)` where `0=Against`, `1=For`, `2=Abstain`
4. **Succeeded** if `for > against` and `for+abstain >= quorum`
5. **Queue** — `governor.queue(id)` registers actions on the timelock
6. **Execute** — after `delay`, `governor.execute(id)` runs the calls

## Example: raise reserves

```js
const data = token.interface.encodeFunctionData("updateReserves", [5000]);
await governor.propose([tokenAddr], [0], [data], "Raise reserves to 5000 bags");
// ... wait votingDelay, vote, wait votingPeriod ...
await governor.queue(proposalId);
// ... wait timelock delay ...
await governor.execute(proposalId);
```

## Deploy

```bash
npm install
npx hardhat compile
npx hardhat test test/ZarTATOGovernor.test.js

# Fresh token + governance
npx hardhat run scripts/deployGovernance.js --network bsctestnet

# Attach to existing token
TOKEN_ADDR=0x... ORACLE_ADDR=0x... npx hardhat run scripts/deployGovernance.js --network bsctestnet
```

## Security notes

- Voting power uses **current** `balanceOf` at vote time (simple prototype). For mainnet, prefer OpenZeppelin `ERC20Votes` + Governor for block snapshots (flash-loan resistance).
- Always transfer token/oracle **ownership to the Timelock**, not the Governor directly.
- Keep MultiSig as a recovery path only if you deliberately leave an escape hatch; otherwise full ownership on Timelock is cleaner.
- Tune `votingPeriod` to your chain’s block time (BSC ≈ 3s).

## Handoff checklist

- [ ] Deploy Timelock + Governor
- [ ] `timelock.setAdmin(governor)`
- [ ] `token.transferOwnership(timelock)`
- [ ] `oracle.transferOwnership(timelock)` (optional)
- [ ] Run a test proposal on testnet end-to-end
- [ ] Publish Governor + Timelock addresses to the community
