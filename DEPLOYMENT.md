# ZarTATO Deployment Guide — Base L2

## Overview

ZarTATO is a **fixed-supply ERC-20 token** on Base L2 with:
- Total supply: 1,000,000,000 ZRT (no minting, no burning)
- Price discovery via Aerodrome DEX only
- Thandi oracle informational only (Discord bot display)

This guide covers testnet (Base Sepolia) and mainnet (Base) deployment.

---

## Prerequisites

- **Node.js 18+**
- **npm or pnpm**
- **Hardhat** (included in package.json)
- **A funded Base wallet** with some ETH:
  - **Base Sepolia (testnet):** Get testnet ETH from [faucet.quicknode.com](https://faucet.quicknode.com)
  - **Base Mainnet:** Buy ETH or bridge from Ethereum

---

## Step 1: Setup Environment

```bash
git clone https://github.com/thatojane303/thatojane303-zartato.git
cd thatojane303-zartato
npm install
cp .env.example .env
```

Edit `.env`:
```env
# Base network RPCs
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Your private key (never commit this!)
PRIVATE_KEY=0x...your_base_wallet_private_key_here...

# BaseScan API key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key

# Thandi oracle (informational only, not used on-chain)
RPC_URL=https://mainnet.base.org
ORACLE_KEY=0x...
ZARTATO_ADDRESS=  # Set after deployment
```

**⚠️ SECURITY:** Never commit `.env` with your private key. The `.env.example` file is safe to commit.

---

## Step 2: Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

---

## Step 3: Run Tests (Local)

```bash
npx hardhat test
```

Expected output:
```
  ZarTATO ERC20
    ✓ should have correct name and symbol
    ✓ should have 1B total supply
    ✓ should prevent minting
    ✓ should prevent burning

  4 passing
```

---

## Step 4: Deploy to Base Sepolia (Testnet)

### 4A: Check Your Balance

```bash
npx hardhat run scripts/check-balance.js --network baseSepolia
```

You should see your Base Sepolia ETH balance.

### 4B: Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Expected Output:**
```
🔑 Deploying with: 0x...
💰 Balance: 0.5 ETH on baseSepolia

📦 Deploying ZarTATO (fixed-supply ERC-20)...
✅ ZarTATO deployed to: 0x...

📊 Total supply: 1000000000.0 ZRT
💎 Deployer balance: 1000000000.0 ZRT

============================================================
 ZarTATO Deployment Complete 🥔
============================================================
 Token Address:   0x...
 Deployer:        0x...
 Network:         baseSepolia
 Chain ID:        84532
 Total Supply:    1000000000.0 ZRT
============================================================
```

**Save the token address!** You'll need it for verification and next steps.

---

## Step 5: Verify Contract on BaseScan

```bash
npx hardhat verify --network baseSepolia <TOKEN_ADDRESS>
```

Example:
```bash
npx hardhat verify --network baseSepolia 0x1234567890123456789012345678901234567890
```

Once verified, you can view and interact with the contract at:
```
https://sepolia.basescan.org/address/0x...
```

---

## Step 6: Deploy to Base Mainnet

### 6A: Prepare Mainnet .env

Update `.env` with:
```env
BASE_MAINNET_RPC=https://mainnet.base.org
PRIVATE_KEY=0x...
BASESCAN_API_KEY=your_key
```

### 6B: Deploy to Mainnet

```bash
npx hardhat run scripts/deploy.js --network baseMainnet
```

### 6C: Verify on BaseScan Mainnet

```bash
npx hardhat verify --network baseMainnet <TOKEN_ADDRESS>
```

View at:
```
https://basescan.org/address/0x...
```

---

## Step 7: Post-Deployment Setup

### 7A: Transfer to Liquidity Provider

The deployer initially holds the full 1B supply. Transfer to LP pool:

```solidity
// In Hardhat console or script:
const token = await ethers.getContractAt("ZarTATO", "0x...");
const lpAddress = "0x...aerodrome_lp_address...";
const toTransfer = ethers.parseUnits("400000000", 18); // 40% for LP
await token.transfer(lpAddress, toTransfer);
```

### 7B: Setup Team Vesting (Optional)

Reserve 15% for team using [Sablier](https://sablier.com):
- Vesting stream: 12-month linear
- Amount: 150,000,000 ZRT

### 7C: Community Allocation

- 45% to community (Discord, airdrops, etc.)
- Deploy via Aerodrome or governance

---

## Deployment Summary

| Environment | Chain | Explorer |
|---|---|---|
| **Testnet** | Base Sepolia (84532) | https://sepolia.basescan.org |
| **Mainnet** | Base (8453) | https://basescan.org |

---

## Troubleshooting

### Error: "insufficient funds for gas"
- Get more testnet ETH from [faucet.quicknode.com](https://faucet.quicknode.com)
- Mainnet requires real ETH; bridge from Ethereum

### Error: "invalid private key"
- Check `.env` — `PRIVATE_KEY` should be 66 chars (0x + 64 hex)
- Never include the `0x` twice

### Error: "network not found"
- Verify `hardhat.config.js` has `baseMainnet` and `baseSepolia` defined
- Check RPC URLs are correct in `.env`

### Contract verified but not showing on BaseScan
- Wait 1-2 minutes for indexing
- Refresh page
- Verify you used the correct network (Sepolia vs Mainnet)

---

## Next Steps

1. ✅ Contract deployed and verified
2. 🔄 Create Aerodrome LP pool (40% locked 12 months)
3. 🤖 Deploy Musa Discord bot for `/price` command
4. 📊 Thandi oracle reads for Dashboard display
5. 🎓 Launch South African education events

---

## Links

- **Base Network:** https://base.org
- **Aerodrome DEX:** https://aerodrome.finance
- **BaseScan:** https://basescan.org
- **Hardhat Docs:** https://hardhat.org/docs
- **OpenZeppelin Docs:** https://docs.openzeppelin.com

---

## Questions?

See also:
- `GRANT_SUBMISSION.md` — funding and grant details
- `TOKENOMICS.md` — token allocation and structure
- `README.md` — project overview
