# Deployment secrets

CI does not need a private key: npm ci, compilation, and tests run locally on Hardhat.

## Local Base Sepolia deployment

1. Copy .env.example to .env.
2. Add a dedicated testnet wallet key to PRIVATE_KEY.
3. Optionally set BASE_SEPOLIA_RPC and BASESCAN_API_KEY.
4. Keep .env local; it is ignored by git. Never commit or share it.

## Optional GitHub Actions deployment

The Deploy to Base Sepolia workflow is manual and asks for a confirmation value. If you choose to use it, add only a dedicated testnet wallet key as the PRIVATE_KEY Actions secret. BASE_SEPOLIA_RPC is optional; the workflow defaults to the public Base Sepolia RPC when omitted.

Do not add a mainnet key to this workflow. No price updater, BSC workflow, Chainlink subscription, ORACLE_ADDR, or SUB_ID is used by the current Base project.
