# Foundry & Deployment notes

This project primarily uses Hardhat, but these notes include Foundry setup commands if you want to use forge for local testing or deployment.

## Foundry (optional)

Install Foundry:

curl -L https://foundry.paradigm.xyz | bash
foundryup

Initialize a new forge project (optional):

forge init zartato
# put ZarTATO.sol in src/ if using Foundry

## Hardhat / deployment

Example Hardhat deploy (scripts/deployTimelock.js). Before deploying, update the LP token address in the script:

LP_TOKEN_ADDRESS="0x..." # replace with the LP token address after adding liquidity

To deploy using Hardhat:

npx hardhat run scripts/deployTimelock.js --network <network>

Example forge create (if deploying with Foundry; replace PRIVATE_KEY and RPC URL):

forge create --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545/ --private-key YOUR_KEY src/ZarTATO.sol:ZarTATO --chain 97
