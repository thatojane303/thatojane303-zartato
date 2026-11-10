# ZarTATO (ZRT)

ZarTATO is an educational, fixed-supply ERC-20 experiment for Base, using South African potato-market culture as a teaching context. It is not a potato peg, a commodity-backed token, or an investment product.

## Current status

Status checked 2026-11-09. This repository is pre-launch; it does not represent a live token or market-data product.

| Check | Current state |
| --- | --- |
| Contract | Fixed-supply ERC-20 in contracts/ZarTATO.sol |
| Supply | 1,000,000,000 ZRT minted once to the deployer when deployed |
| Mint and burn | Public entry points revert; no further issuance is intended |
| Base Sepolia | No deployed contract address recorded; deployment file is still a zero-address placeholder |
| Base mainnet | Not deployed |
| Public product demo | No working demo verified; the previously configured Vercel URL returned 404 on 2026-11-09 |
| Market data | oracle/thandi.js is a local mock only; no live market source or onchain oracle is connected |
| Liquidity and vesting | No pool, LP lock, or vesting contract exists |
| Security review | Not audited |
| Tests | 17 Hardhat tests are included; run the commands below and check the PR workflow before relying on them |

The full grant-readiness status and draft are in GRANT_SUBMISSION.md. Base describes its grants as selective, up to $5,000, and identifies Builder Codes as the first step toward grant eligibility. This repository alone does not establish eligibility or guarantee funding.

## Run locally

Use Node.js 22. Install the locked dependencies and run the compiler and tests:

1. npm ci
2. npm run compile
3. npm test

The test and compile commands do not require a private key.

## Base Sepolia deployment

Deployment is manual and requires a funded test wallet. Copy .env.example to .env and set PRIVATE_KEY locally; never commit .env or paste a private key into an issue, PR, or chat. Then run npm run deploy:testnet. The optional GitHub workflow also requires an explicit confirmation input.

Do not deploy to Base mainnet until a Base Sepolia deployment is verified, the ownership and token-distribution plan are clear, and an independent security review is complete. No deployment was performed as part of this repository change.

## Design boundaries

- The contract mints its fixed supply once to the deployer. It does not implement reserves, a price peg, redemption, fees, staking, liquidity locks, or team vesting.
- No Aerodrome pool exists in this repository state.
- Thandi is a local mock display script, not a live oracle or source of token pricing.

## License

MIT. See LICENSE.
