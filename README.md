# ZarTATO: South African Potato Market Token

A Bitcoin-backed utility token pegged to South African potato market metrics on Binance Smart Chain Testnet.

## Overview

ZarTATO (ZRT) is an ERC-20 token that:
- Tracks real-world South African potato prices (Grade 1, 10kg bags)
- Uses Chainlink Functions to fetch live market data from Johannesburg, Tshwane, and Cape Town markets
- Maintains a median price feed across 3 sources for robustness
- Operates on BSC Testnet (Chain ID: 97)

## Project Structure

```
zartato/
├── contracts/              # Smart contracts
│   ├── ZarTATO.sol        # ERC-20 token with reserve backing
│   ├── ZarTATOOracle.sol  # Chainlink Functions consumer
│   └── MockFunctionsRouter.sol  # Testing mock
├── scripts/               # Deployment scripts
│   ├── deployAndRequest.js
│   └── deploy.js
├── tasks/                 # Hardhat tasks
│   └── update-price.js
├── functions/             # Chainlink Functions JavaScript sources
│   └── potato-price.js
├── test/                  # Test suites
│   └── ZarTATO.test.js
├── .github/workflows/     # GitHub Actions CI/CD
│   └── daily-price.yml
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Dependencies
└── .env.example           # Environment template
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm or pnpm
- A funded wallet on BSC Testnet

### Installation

```bash
git clone https://github.com/thatojane303/thatojane303-zartato.git
cd thatojane303-zartato
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
PRIVATE_KEY=0x...your_bsc_testnet_private_key
FUNCTIONS_ROUTER=0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715
SUBSCRIPTION_ID=0  # Set after creating Chainlink Functions subscription
ETHERSCAN_API_KEY=  # For contract verification (optional)
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to BSC Testnet

```bash
npx hardhat run scripts/deployAndRequest.js --network bsctestnet
```

### Request Price Update (Manual)

```bash
npx hardhat update-price --oracle 0x... --subid 123 --network bsctestnet
```

## Smart Contracts

### ZarTATO (ERC-20 Token)
- **Minting:** Owner only, capped by physical reserve
- **Burning:** Supported via `burnFromReserve()`
- **Oracle Integration:** Reads price from `ZarTATOOracle`
- **Reserve Tracking:** 1 ZRT = 1 bag of 10kg potatoes

### ZarTATOOracle (Chainlink Functions Consumer)
- **Data Sources:** Johannesburg, Tshwane, Cape Town markets
- **Aggregation:** Median price across 3 sources
- **Update Frequency:** Daily (configurable via GitHub Actions)
- **Price Format:** ZAR cents per 10kg bag

## Chainlink Functions Integration

The oracle uses Chainlink's Decentralized Oracle Network (DON) to:
1. Execute JavaScript code off-chain
2. Fetch market data from real sources
3. Return results to the smart contract

**Subscription Setup:**
1. Go to [functions.chain.link](https://functions.chain.link)
2. Create a subscription on BSC Testnet
3. Fund it with LINK tokens
4. Add your deployed `ZarTATOOracle` contract as a consumer
5. Set `SUBSCRIPTION_ID` in `.env`

## GitHub Actions Workflow

Automated daily price updates (10:00 SAST, Mon-Fri):
```yaml
name: Daily ZRT Price Update
on:
  schedule:
    - cron: '0 8 * * 1-5'
  workflow_dispatch:
```

**Required Secrets:**
- `PRIVATE_KEY`: BSC Testnet wallet private key
- `ORACLE_ADDR`: Deployed ZarTATOOracle contract address
- `SUB_ID`: Chainlink Functions subscription ID

Set these in repo **Settings > Secrets > Actions**

## Testing

Comprehensive test suite covering:
- Reserve-backed minting
- Oracle price feeds
- Multi-source aggregation
- Access control

Run tests:
```bash
npx hardhat test
```

## Verification

Verify contracts on BSCScan Testnet:

```bash
npx hardhat verify --network bsctestnet <TOKEN_ADDRESS> <OWNER_ADDRESS>
npx hardhat verify --network bsctestnet <ORACLE_ADDRESS> 0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715
```

## Development

### Create New Feature Branch
```bash
git checkout -b feature/your-feature dev
```

### Commit & Push
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature
```

### Create Pull Request
Submit PR against the `dev` branch on GitHub.

## Narration Scripts

See `docs/narration.md` for video production scripts:
- Full walkthrough (5 min)
- Quick demo (60 sec)
- Slide deck outline

## Networks

- **BSC Testnet** (Primary)
  - Chain ID: 97
  - RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
  - Functions Router: 0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715

## License

MIT

## Support

For issues, questions, or contributions, open an issue or pull request on GitHub.

---

**Built with:**
- Hardhat
- OpenZeppelin Contracts
- Chainlink Functions
- Ethers.js v6
