# ZarTATO Tokenomics — BRETT Trade-Only Model

**Fixed Supply: 1,000,000,000 ZRT (No Mint Function)**

## Allocation

| Category | % | Amount | Notes |
|----------|---|--------|-------|
| Aerodrome LP | 40% | 400M | Locked liquidity, trade-only price discovery |
| Oracle & Infra | 15% | 150M | Thandi.js informational feed, not backing |
| Community & Education | 15% | 150M | Musa Bot, content, SA education |
| Team | 15% | 150M | 12-month linear vest |
| Treasury | 15% | 150M | Grants, audits, future dev |

## Key Principles (For Aerodrome Grants)

1. **No Reserve Backing** — ZRT is NOT backed by potatoes, ZAR, or commodities. Price = DEX trading only.
2. **No Mint/Burn** — `TOTAL_SUPPLY` immutable in constructor. No owner mint.
3. **No Yield Farming** — No staking rewards, no APY promises. BRETT model = trade only.
4. **No Oracle Peg** — Thandi.js provides informational SA market context, does NOT set on-chain price.
5. **Educational Disclaimer** — All docs state: educational/cultural experiment, not financial advice.

## Vesting

- Team: 12-month cliff + linear (via Sablier or manual)
- LP: Locked 12 months via Aerodrome locker

## Compliance Note

This model avoids security-like promises (no backing, no yield) to align with Base ecosystem educational grants.