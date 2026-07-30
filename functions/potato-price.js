/**
 * Chainlink Functions source — South African potato price aggregation.
 * Fetches Grade-1 10kg bag prices from representative market sources and
 * returns the median in ZAR cents (integer).
 *
 * NOTE: Replace the sample endpoints / parsing with live market APIs or
 * trusted data providers before mainnet. This file is the off-chain source
 * string uploaded to Chainlink Functions.
 */

// Example structure for Chainlink Functions JavaScript runtime
const sources = [
  // Johannesburg / Tshwane / Cape Town style placeholders
  "https://example-market-data.invalid/jhb/potato-grade1-10kg",
  "https://example-market-data.invalid/tshwane/potato-grade1-10kg",
  "https://example-market-data.invalid/cpt/potato-grade1-10kg",
];

async function fetchPrice(url) {
  try {
    const response = await Functions.makeHttpRequest({ url, timeout: 9000 });
    if (response.error) return null;
    // Expect JSON like { priceZar: 45.5 } or { cents: 4550 }
    const data = response.data;
    if (data.cents != null) return Number(data.cents);
    if (data.priceZar != null) return Math.round(Number(data.priceZar) * 100);
    return null;
  } catch (e) {
    return null;
  }
}

const prices = [];
for (const url of sources) {
  const p = await fetchPrice(url);
  if (p != null && p > 0) prices.push(p);
}

if (prices.length === 0) {
  throw Error("No valid potato prices fetched");
}

prices.sort((a, b) => a - b);
const mid = Math.floor(prices.length / 2);
const median =
  prices.length % 2 === 0
    ? Math.round((prices[mid - 1] + prices[mid]) / 2)
    : prices[mid];

// Return uint256-compatible bytes for the consumer contract
return Functions.encodeUint256(median);
