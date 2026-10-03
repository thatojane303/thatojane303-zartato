# ZarTATO Grant Submission — Aerodome Base Community Round

**Project:** ZarTATO (ZRT)  
**Model:** Fixed-supply community token on Base L2  
**Status:** Ready for audit and mainnet deployment  
**Ask:** R1,200,000 ZAR  

---

## Executive Summary

ZarTATO is an **educational, fixed-supply community token** demonstrating:
- **Smart contract development** (Solidity, ERC-20, OpenZeppelin patterns)
- **CI/CD automation** (GitHub Actions, Hardhat testing)
- **Base L2 integration** (Aerodrome DEX, optimized gas costs)
- **Community engagement** (Discord bot, educational content)

It is **NOT** a financial security, yield vehicle, or commodity derivative. ZarTATO is a fixed-supply community token for Base community building and blockchain education.

---

## Model & Risk Mitigation

### Current Model (Simple, Compliant)
✅ Fixed supply: 1,000,000,000 ZRT (no minting, no burning)  
✅ Price discovery: **Aerodrome DEX only** (no off-chain peg mechanism)  
✅ Thandi Oracle: **Informational only** (displays in Discord, not on-chain)  
✅ No financial yield, staking, or APY promises  
✅ Explicit disclaimer: "Educational experiment, no intrinsic value"  

**Why this avoids regulatory risk:**
- Not a security (no yield, no revenue share, no control)
- Not a stablecoin (no peg, no reserve)
- Not a commodity derivative (oracle is informational only)
- Clear disclaimer and educational framing

### Previous Model (Rejected)
❌ Commodity backing (potato redemption) → securities risk  
❌ Reserve-backed minting → likely classified as security  
❌ On-chain oracle peg → stablecoin-like structure → regulatory friction  

**Decision:** Pivot to fixed-supply community model for regulatory clarity and grant eligibility.

---

## Technical Implementation

### Smart Contracts
- **ERC-20 Token (ZarTATO.sol)**
  - Fixed supply, OpenZeppelin standard
  - Access control for future governance
  - Minimal gas footprint on Base
  
### Deployment
- **Chain:** Base Mainnet (8453)
- **DEX:** Aerodrome Finance
- **RPC:** https://mainnet.base.org

### Informational Oracle (Thandi)
- Fetches reference price data (mockable for testing)
- Generates dashboard tiles for Discord display
- Zero on-chain impact on token valuation
- Can run independently; contract never reads from it

### Testing & CI/CD
- Hardhat test suite (ERC-20 standard compliance)
- GitHub Actions matrix builds (Node.js 18, 20, 22)
- Gas reports, contract verification
- Automated deployment pipelines

---

## Use of Funds (R1.2M Breakdown)

| Item | ZAR | % | Justification |
|------|-----|---|---|
| Smart Contract Audit | R300,000 | 25% | CertiK / OpenZeppelin for mainnet deployment |
| Aerodrome Liquidity Seeding | R400,000 | 33% | 40% supply LP lock 12 months |
| Education & Community (SA) | R200,000 | 17% | Musa Bot development, workshops, content |
| Infrastructure & Oracle | R150,000 | 12.5% | Base RPC, BaseScan verification, Thandi uptime |
| Legal & Compliance | R100,000 | 8.3% | Educational disclaimer, grant compliance memo |
| Operations & Buffer | R50,000 | 4.2% | Team ops, unforeseen costs |

---

## Milestones & Deliverables

### Phase 1: Audit & Verification (Month 1–2)
✅ Smart contract audit complete  
✅ BaseScan verification live  
✅ Disclaimer review with legal  

### Phase 2: Launch (Month 3)
✅ Base Mainnet deployment  
✅ Aerodrome LP seeding + lock  
✅ Thandi oracle live  

### Phase 3: Community (Month 4–6)
✅ Musa Bot `/price` command live  
✅ 3+ South African blockchain education events  
✅ Documentation & tutorials published  

---

## Team & Governance

**Lead:** Thato Jane (@thatojane303)  
**Role:** Smart contract development, community, Base L2 builder  

**Team Lock:**
- 15% of supply reserved for team
- 12-month linear vest via Sablier
- Ensures long-term alignment

---

## Repository Structure

```
thatojane303-zartato/
├── contracts/                # ERC-20 token + informational oracle
├── scripts/                  # Hardhat deployment
├── test/                     # Test suite (Hardhat + Mocha)
├── oracle/                   # Thandi informational service
├── .github/workflows/        # CI/CD (GitHub Actions)
├── docs/                     # Technical docs, tokenomics
├── FUNDING-r1.2M.md          # Detailed funding request
├── GRANT_SUBMISSION.md       # This file
├── README.md                 # Project overview
└── package.json              # Dependencies
```

---

## Success Metrics

- ✅ Smart contract audit pass  
- ✅ Mainnet deployment & verification  
- ✅ Liquidity locked 12 months  
- ✅ 100+ Discord community members  
- ✅ 3+ SA education events completed  

---

## Compliance & Disclaimers

**ZarTATO is an educational experiment.** It has:
- No intrinsic value
- No commodity backing
- No yield, staking, or APY
- No financial promises
- No control over underlying assets

**Price discovery** is determined **entirely by Aerodrome DEX** trading liquidity.  
**Thandi oracle** is for informational display only and does NOT affect token valuation.

---

## Questions?

For technical details, see:
- **Smart Contract Docs:** `docs/`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Funding Breakdown:** `FUNDING-r1.2M.md`

**Repo:** https://github.com/thatojane303/thatojane303-zartato
