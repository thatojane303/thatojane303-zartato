# Base deployment guide

## Status and scope

The current contract is not recorded as deployed on Base Sepolia or Base mainnet. Deployment files contain placeholders. This guide covers the fixed-supply ERC-20 only; it does not deploy an oracle, market-data feed, liquidity pool, lock, or vesting contract.

Deployment is manual. This PR does not deploy anything.

## Prerequisites

- Node.js 22 and npm
- A dedicated Base Sepolia test wallet funded with test ETH
- A local .env file based on .env.example; never commit it

## Compile and test

1. npm ci
2. npm run compile
3. npm test

The local compile and tests do not require PRIVATE_KEY.

## Deploy to Base Sepolia

1. Put the test wallet's PRIVATE_KEY in the local .env file, or configure it as the PRIVATE_KEY secret for the manual Base Sepolia GitHub workflow.
2. Optionally set BASE_SEPOLIA_RPC; the default is the public Base Sepolia RPC.
3. Run npm run deploy:testnet, or manually dispatch Deploy to Base Sepolia and type base-sepolia in the confirmation field.
4. Verify the printed address and transaction on BaseScan. The deployment script writes a local deployment.json file, which is ignored by git.
5. Update deployments/base-sepolia.json only after independently verifying the chain, contract, supply, and address.

Do not commit private keys or deployment secrets. Do not paste them into pull requests, issues, or chat.

## Mainnet gate

The package includes a mainnet command, but do not run it until the testnet deployment is verified, the owner and initial-supply controls are documented, the product has a real use case, and an independent security review has been completed. Confirm any required mainnet safeguards and funding with the project owner first.

## Price and distribution claims

The token contract does not read a price. oracle/thandi.js is a local mock that writes example data only. There is no live market feed. The contract does not lock liquidity or vest tokens; any future distribution plan needs its own implementation and review.
