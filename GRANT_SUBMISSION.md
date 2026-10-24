# Base grant packet — ZarTATO

**Project:** ZarTATO (ZRT)
**Builder:** Thato Jane (`thatojane303`), Vereeniging, Gauteng
**Network of record:** Base. Testnet first (chain id 84532), mainnet only after a verified test deploy.
**Program this packet is for:** [Base Builder Grants](https://docs.base.org/get-started/get-funded) — up to $5,000 for a shipped project, not a R1.2 million raise.
**Application form:** [Base Builder Grant Program](https://docs.google.com/forms/d/e/1FAIpQLSeEFi9BLm5XCm7KrFzRZC-rxcAqCNZPzWZ9He4aZkxsKuRXjw/viewform)

Do not submit the form yet. Base asks for a **live product link**, a **contract address on Base**, and a **Builder Code**. All three are still empty. Submitting zeros or another token's address will fail review.

## What is true today

- Open-source ERC-20 in this repo. Fixed supply. `mint`, `burn`, and `burnFrom` revert.
- OpenZeppelin 5 constructor: `Ownable(msg.sender)`. Compiles. 17 Hardhat tests pass.
- CI compiles and tests on push to `main` (`.github/workflows/ci.yml` and `node.js.yml`).
- Base Sepolia deploy is manual (`workflow_dispatch` on `.github/workflows/deploy-sepolia.yml`, or `npm run deploy:testnet`). It does not run on every push, and it does not target Ethereum Sepolia.
- No users, no volume, no revenue, no audit, no Aerodrome pool.

## What Base will check

| Form field | Answer you can give now | Blocker |
| --- | --- | --- |
| Project name + one line | ZarTATO (ZRT) — educational fixed-supply token and market desk for South African builders on Base | None |
| Team | Solo. Thato Jane. No prior company, no prior raise. Based in Gauteng. The domain is local produce-market culture used as a teaching story, not as collateral. | None |
| Track | Closest fit is **new asset creation**. It is not a prediction market, launchpad, or lending protocol. | Do not force a track it is not |
| Live product |  | Publish the desk, then paste the URL |
| Product demo (Loom) |  | Record the desk and a testnet transfer |
| Contract address on Base |  | Deploy to Base Sepolia, then mainnet. Paste only that contract |
| Usage numbers | All-time users 0. DAU 0. WAU 0. Volume 0. | Leave the zeros. Do not estimate |
| How it makes money | It does not. No fee switch, no staking, no sale of the token by the deployer is promised. | None |
| GTM, next 3 months | 1) Base Sepolia deploy and BaseScan verify. 2) Register a Builder Code and attribute app transactions. 3) One public Gauteng session using the desk. 4) Mainnet only after the testnet contract is the one in this README. | Needs the deploy |
| Builder Code |  | Register at [dashboard.base.org](https://dashboard.base.org/). Docs: [Builder Codes](https://docs.base.org/base-chain/builder-codes) |
| Bottleneck | No testnet gas spent yet, so there is no contract address to put on the form. | Faucet + deploy |
| Useful credits | Base Sepolia ETH, BaseScan verification, a short independent review, Africa regional amplification after the address is real. | Not a CertiK-sized audit |

## If the grant is $5,000

Spend it on shipping, not on a liquidity story the grant cannot fund.

| Use | Amount | Why |
| --- | --- | --- |
| Testnet, mainnet gas, BaseScan | $200 | Get a real address |
| Independent review of `ZarTATO.sol` | $1,500 | The contract is small. A full firm audit is a later round, not this one |
| Public demo hosting + Loom | $300 | The form requires both |
| One Gauteng builder session | $1,000 | Teaching use, which is the actual product |
| Docs, discord `/price` display, buffer | $2,000 | Thandi stays off-chain |

The R1.2 million sheet in `FUNDING-r1.2M.md` is a later budget sketch. It is not this application. Quoting it to Base makes the project look like it does not know the program.

## Submit only when these three exist

1. `deployments/base-sepolia.json` has a non-zero `address` that opens on [Sepolia BaseScan](https://sepolia.basescan.org) as ZarTATO, 1,000,000,000 supply.
2. The README status table matches that address.
3. A Builder Code from the Base dashboard is written here, and the public demo URL is live.

## Links

- Repo: https://github.com/thatojane303/thatojane303-zartato
- Get funded: https://docs.base.org/get-started/get-funded
- Faucet: https://portal.cdp.coinbase.com/products/faucet
- Explorer (testnet): https://sepolia.basescan.org
