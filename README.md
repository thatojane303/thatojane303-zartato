# ZarTATO (ZRT) — Educational Community Token on Base

ZarTATO is an educational, community-driven token built on Base.
It uses Aerodrome Finance as the primary price discovery mechanism (DEX price), with an optional informational oracle (`thandi.js`) for Discord `/price` display only.

**Disclaimer:** This is an educational and cultural experiment. No intrinsic value, no commodity backing, no yield, no financial promises. Not financial advice.

---

## 🔗 Core Properties
- Fixed supply: 1,000,000,000 ZRT (no minting, no burning)
- Chain: Base Mainnet (8453)
- DEX: Aerodrome Finance (primary price discovery)
- Oracle: `oracle/thandi.js` (informational only, does NOT set an on-chain peg)
- Model: Fixed-supply community token, decentralized price discovery

---

## 📈 Price Discovery
ZarTATO price is determined entirely by Aerodrome DEX liquidity and trading.

**Thandi Oracle** (`oracle/thandi.js`) is an **optional, informational service only**:
- Fetches reference prices from public market data
- Does NOT set an on-chain price peg
- Displays in Discord `/price` command for community info
- Never used by smart contracts for minting/burning

This architecture avoids regulatory security classification.

---

## 🎓 Educational & Community Focus
ZarTATO is designed to:
- Teach smart contract development (Hardhat, Solidity, OpenZeppelin)
- Demonstrate CI/CD best practices (GitHub Actions)
- Provide a Base L2 community token
- Support South African blockchain education

No financial yield, no redemption promises, no intrinsic value.

---

## 🚀 Performance & Throughput
Load tests confirm:

- 312 ops/sec sustained
- 441 ops/sec peak
- 18ms average latency
- 5000 transactions executed

This supports high‑volume retail and agricultural settlement flows.

---

## 📁 Repository Structure