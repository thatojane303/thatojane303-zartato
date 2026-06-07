# ZarTATO Deployment Guide

## Prerequisites

- Node.js 20+
- npm or pnpm
- Hardhat
- A funded BSC Testnet wallet (faucet: https://testnet.binance.org/faucet)
- LINK tokens for Chainlink Functions (if using live oracle)

## Step 1: Setup Environment

```bash
git clone https://github.com/thatojane303/thatojane303-zartato.git
cd thatojane303-zartato
npm install
cp .env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=0x...your_bsc_testnet_key
FUNCTIONS_ROUTER=0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715
SUBSCRIPTION_ID=0  # Update after creating subscription
```

## Step 2: Compile Contracts

```bash
npx hardhat compile
```

Output should show:
```
ZarTATO
ZarTATOOracle
MockFunctionsRouter
```

## Step 3: Run Tests

```bash
npx hardhat test
```

Expected output:
```
  ZarTATO Reserve Backing
    Reserve Constraints
      ✓ Should not mint more than reserves
      ✓ Should allow burning and update supply
      ✓ Should track 1 ZRT = 1 bag = 10kg
    Oracle Integration
      ✓ Should revert getPrice if oracle not set
      ✓ Should allow owner to set oracle
      ✓ Should not allow non-owner to set oracle
    Access Control
      ✓ Should only allow owner to mint
      ✓ Should only allow owner to update reserves

  9 passing
```

## Step 4: Deploy to BSC Testnet

### Option A: Full Deployment (with Oracle Request)

```bash
npx hardhat run scripts/deployAndRequest.js --network bsctestnet
```

**Note:** This requires an active Chainlink Functions subscription.

### Option B: Simple Deployment

```bash
npx hardhat run scripts/deploy.js --network bsctestnet
```

### Deployment Output

```
🔑  Deploying contracts with: 0x...
💰 Account balance: 0.5 BNB

📦  Deploying ZarTATO token...
✅  ZarTATO deployed to: 0x...

📡  Deploying ZarTATOOracle...
✅  ZarTATOOracle deployed to: 0x...

🔗  Linking oracle to token...
✅  Oracle linked!

📊  Setting initial reserves (1000 bags)...
✅  Initial reserves set!

============================================================
  ZarTATO Deployment Complete 🥔
============================================================

📋  Deployment Summary:
  Token Address:   0x...
  Oracle Address:  0x...
  Deployer:        0x...
  Network:         bsctestnet
```

## Step 5: Verify Contracts (Optional)

```bash
npx hardhat verify --network bsctestnet 0xTOKEN_ADDRESS deployer_address
npx hardhat verify --network bsctestnet 0xORACLE_ADDRESS 0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715
```

## Step 6: Setup Chainlink Functions (For Live Oracle)

1. **Create Subscription:**
   - Go to https://functions.chain.link
   - Connect with your wallet
   - Click "Create Subscription"
   - Fund with LINK tokens (minimum 5 LINK recommended)

2. **Add Consumer:**
   - Copy your deployed `ZarTATOOracle` address
   - In subscription, click "Add Consumer"
   - Paste the oracle address
   - Approve transaction

3. **Update .env:**
   ```env
   SUBSCRIPTION_ID=your_subscription_id
   ```

4. **Test Oracle Request:**
   ```bash
   npx hardhat update-price --oracle 0x... --subid 123 --network bsctestnet
   ```

## Step 7: Setup GitHub Actions (For Automated Updates)

### Add Secrets

Go to repo **Settings > Secrets > Actions** and add:

- **PRIVATE_KEY**: Your BSC Testnet private key
- **ORACLE_ADDR**: Your deployed ZarTATOOracle address
- **SUB_ID**: Your Chainlink Functions subscription ID

### Verify Workflow

The workflow will run:
- **Trigger:** 10:00 UTC (Mon-Fri) = 10:00 SAST
- **Action:** Request latest potato prices
- **Logs:** Check **Actions > Daily ZRT Price Update**

## Verification Checklist

- [ ] Contracts compile without errors
- [ ] All tests pass
- [ ] Token deployed to testnet
- [ ] Oracle deployed and linked
- [ ] Initial reserves set (1000 bags)
- [ ] Contracts verified on BSCScan (optional)
- [ ] Chainlink Functions subscription created
- [ ] Oracle added as consumer
- [ ] GitHub Actions secrets configured
- [ ] First price update received

## Troubleshooting

### Error: "Insufficient funds"
Fund your wallet with testnet BNB:
https://testnet.binance.org/faucet

### Error: "Invalid subscription ID"
Ensure `SUBSCRIPTION_ID` is set correctly in `.env`

### Error: "Chainlink Functions router not found"
Confirm you're on BSC Testnet (Chain ID: 97)

### Oracle request times out
Check Chainlink DON status at https://functions.chain.link

## Next Steps

1. Monitor price updates on BSCScan
2. Test token transfers
3. Review oracle aggregation logic
4. Plan mainnet deployment

## Deployment Contracts

**Token (ERC-20)**
- Name: ZarTATO
- Symbol: ZRT
- Decimals: 18
- Initial Supply: 0 (mint-on-demand)

**Oracle (Chainlink Functions Consumer)**
- Data Sources: 3 SA markets
- Aggregation: Median price
- Update Frequency: Daily (configurable)
- Price Unit: ZAR cents per 10kg bag
