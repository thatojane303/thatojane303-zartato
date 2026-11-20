# Base build and deployment notes

This repository uses Hardhat. Foundry is not configured as a second build system, and there is no Timelock contract in the current source tree.

## Local checks

Use Node.js 22:

1. npm ci
2. npm run compile
3. npm test

## Base Sepolia

A fixed-supply token deployment is a manual action. Follow DEPLOYMENT.md and use a dedicated test wallet. The current deployment script does not create an oracle, liquidity pool, liquidity lock, or vesting schedule.
