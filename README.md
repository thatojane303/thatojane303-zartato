# ZarTATO (ZRT)

Educational fixed-supply community token for Base. South African market culture, not a potato peg.

**Disclaimer.** Educational experiment. No intrinsic value, no commodity backing, no yield, no redemption. Not financial advice.

## Status

This repository is the source a Base reviewer should read. It is **not** deployed.

| Check | State |
| --- | --- |
| Contract | `contracts/ZarTATO.sol` — ERC-20 + Ownable, Solidity 0.8.20 |
| Supply | 1,000,000,000 ZRT, minted once to the deployer |
| Mint / burn | Both revert |
| Tests | 17 passing (`npx hardhat test`) |
| Base Sepolia (84532) | Not deployed |
| Base mainnet (8453) | Not deployed |
| Aerodrome pool | Not created |
| Audit | Not started |
| Builder Code | Not registered |
| Intended deployer | `0x1fdd88770343bB07E1859a93B403b1Bc4877Ea8f` |

The zero address in `deployments/` is a placeholder. It is not the token.

Grant packet: [GRANT_SUBMISSION.md](GRANT_SUBMISSION.md).

Older notes (`FUNDING-r1.2M.md`, `COMPLETION_SUMMARY.md`, BSC scripts) are not the current application. Do not quote them as shipped work.

## What a reviewer can run

```bash
git clone https://github.com/thatojane303/thatojane303-zartato.git
cd thatojane303-zartato
npm install
npx hardhat compile
npx hardhat test
```

Node 20. `dotenv` is required because `hardhat.config.js` loads `.env`.

## Deploy (when the wallet has gas)

Do this from your own machine. Do not commit a private key. `.env` is gitignored.

```bash
cp .env.example .env
# set PRIVATE_KEY locally — never paste it into git
npx hardhat run scripts/deploy.js --network baseSepolia
```

Test ETH: [Coinbase CDP faucet](https://portal.cdp.coinbase.com/products/faucet), network **Base Sepolia**.

Then verify:

```bash
npx hardhat verify --network baseSepolia <TOKEN_ADDRESS>
```

Write the printed address into `deployments/base-sepolia.json` and the README status table. Mainnet comes after that address is verified. Gas for a first deploy is small. A paid audit is a later decision, not a claim this repo has already passed.

## Design

- Price, once a pool exists, comes from an Aerodrome ZRT/WETH market. The contract does not read a price.
- `oracle/thandi.js` is an off-chain display script only. No contract calls it.
- There is no staking, fee switch, or redemption for potatoes.

## License

MIT. See [LICENSE](LICENSE).
