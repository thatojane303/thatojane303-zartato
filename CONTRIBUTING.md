# Contributing to ZarTATO

The current project is a fixed-supply Base ERC-20 experiment. BSC, Chainlink, reserve-backed minting, and oracle deployment notes describe an earlier design and are not current implementation requirements.

## Development setup

- Use Node.js 22.
- Install from the committed lockfile with npm ci.
- Run npm run compile and npm test before opening a pull request.
- Pull requests target main. Do not deploy contracts from a pull request.

## Contract changes

- Keep Solidity at the configured version and follow OpenZeppelin patterns.
- Add or update tests for behavior changes, access control, and supply invariants.
- Document whether a capability is implemented, planned, or only a mock.
- Do not claim reserves, an oracle, liquidity locks, vesting, or a completed audit unless the repository and evidence support the claim.

## Secrets and deployment

Never commit .env, private keys, or deployment secrets. Testnet deployment is a separate manual action; mainnet deployment requires explicit project-owner approval and a completed security review.
