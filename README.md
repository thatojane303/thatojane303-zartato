# 🥔 ZarTATO — Real-World Potato Bags Tokenized

**Phase 1 LIVE on Sepolia ✅ | Totem RWA Track Submission**

> 1 ZRT = 10 Bags | Price-fed via Chainlink | Tradable on Uniswap

### 📍 LIVE DEPLOYMENT

| Contract | Address | Etherscan |
|----------|---------|-----------|
| **ZRT Token** | `0xbcb524b2c24376b0e8096dde81ff00f90f9e995e` | [View](https://sepolia.etherscan.io/address/0xbcb524b2c24376b0e8096dde81ff00f90f9e995e) |
| **Oracle** | `See deployment.json artifact` | Router: `0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715` |
| **Network** | Sepolia (11155111) | Chainlink Functions Enabled |

**Deployment Details:**
- Deployer funded via Sepolia faucet
- Initial Supply: 100 ZRT minted to deployer (for Uniswap liquidity)
- Initial Price: R45.00 per 10kg bag (4500 cents) - demo seeded via `oracle.setPrice()`
- Reserve Concept: 1000 bags off-chain tracker (Phase 2 = on-chain attestation)

### 💧 UNISWAP POOL - LIVE TRADING

- **Pair:** ZRT / WETH (Sepolia)
- **Create / Add Liquidity:** https://app.uniswap.org/#/add/v2?chain=sepolia
- **Import Token:** `0xbcb524b2c24376b0e8096dde81ff00f90f9e995e`
- **Fee Tier:** 0.30%
- **Suggested Initial Liquidity:** 50 ZRT + 0.005 SepoliaETH ( ~R45 per token )

### 🧪 HOW TO TEST (For Totem Judges - 1 Minute)

1.  **Add ZRT to MetaMask:**
    - Network: Sepolia
    - Import Token Address: `0xbcb524b2c24376b0e8096dde81ff00f90f9e995e`
    - Symbol: ZRT, Decimals: 18

2.  **Get SepoliaETH:** https://www.alchemy.com/faucets/ethereum-sepolia

3.  **Swap on Uniswap Sepolia:**
    - https://app.uniswap.org/ (Switch to Sepolia)
    - Swap SepoliaETH -> ZRT (paste address)

4.  **Verify on Etherscan:**
    - `totalSupply()` = 100 ZRT
    - `balanceOf(deployer)` = 100 ZRT
    - `oracle()` = oracle address

### 🏗️ ARCHITECTURE
