# ZarTATO (ZRT) — A‑Grade 10kg Potato Price‑Tracking Crypto Asset

ZarTATO is a commodity‑indexed crypto asset built on Base.
Its value tracks the A‑Grade 10kg potato market price using an on‑chain oracle and a multi‑channel redemption/payment network. ZarTATO is designed for transparent price discovery, reliable settlement, and deterministic behavior across agricultural and retail endpoints.

Spaza shops are one redemption node — alongside agri‑coops, farm depots, merchant partners, and distribution hubs — but not the main theme of the system.

---

## 🔗 Core Properties
- Fixed supply: 1,000,000,000 ZRT
- Chain: Base Mainnet (8453)
- DEX: Aerodrome Finance
- Oracle: `oracle/thandi.js` (commodity price fetch + multi‑feed resilience)
- Purpose: commodity price tracking (not pegged, not a stablecoin)

ZarTATO tracks the A‑Grade 10kg potato price, not a retail category.

---

## 📈 Price‑Tracking Architecture
ZarTATO uses a multi‑feed oracle pipeline:

- Chainlink Functions
- fallback feeds
- freshness checks
- failover simulation
- tracking‑error regression

The oracle updates the on‑chain index at deterministic intervals, ensuring alignment with the underlying commodity market.

---

## 🏪 Multi‑Channel Redemption Network
ZarTATO supports multiple redemption/payment endpoints:

- spaza shops
- agri‑coops
- farm depots
- merchant partners
- distribution hubs

Spaza shops are included because they operate at high frequency and provide strong uptime signals — but they are not the main theme of ZarTATO.

---

## 🧪 Reliability & Determinism CI Dashboard
The repository includes a full observability suite, producing JSON dashboard tiles:

- spaza‑uptime — oracle freshness
- multi‑feed‑resilience — failover simulation
- payment‑reliability — tracking‑error regression
- gas‑report — cost efficiency
- deterministic‑behavior — differential consistency
- throughput‑tests — load performance

These tiles are merged into a unified dashboard artifact for grant submission.

---

## ⚙️ Deterministic Behavior
ZarTATO is tested across multiple execution frameworks to ensure:

- valuation consistency
- oracle read consistency
- mint/burn consistency
- staleness‑logic consistency

This ensures predictable behavior across all redemption endpoints.

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