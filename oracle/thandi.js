import axios from "axios";
import { ethers } from "ethers";
import fs from "fs";

// --- Provider + Wallet ---
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.ORACLE_KEY, provider);

// --- Contract Interface ---
const zartato = new ethers.Contract(
  process.env.ZARTATO_ADDRESS,
  ["function updatePrice(uint256 _newPrice) external"],
  wallet
);

// --- Primary + Fallback Feeds ---
async function fetchPrimary() {
  const res = await axios.get("https://api.potato.market/agrade10kg");
  return {
    price: Number(res.data.price),
    timestamp: Number(res.data.timestamp)
  };
}

async function fetchFallback() {
  const res = await axios.get("https://backup-feed.io/potato");
  return {
    price: Number(res.data.price),
    timestamp: Number(res.data.timestamp)
  };
}

// --- Freshness Check ---
function isFresh(feed) {
  const age = Date.now() - feed.timestamp;
  return age < 1000 * 60 * 60; // 1 hour freshness window
}

// --- Main Oracle Logic ---
async function fetchPotatoPrice() {
  let primary, fallback;

  try {
    primary = await fetchPrimary();
  } catch {
    primary = null;
  }

  try {
    fallback = await fetchFallback();
  } catch {
    fallback = null;
  }

  // Decision logic
  if (primary && isFresh(primary)) {
    return primary.price;
  }

  if (fallback && isFresh(fallback)) {
    return fallback.price;
  }

  throw new Error("No fresh potato price feeds available");
}

// --- CI Tile Writer ---
function writeTile(status, price = null, error = null) {
  fs.mkdirSync("./dashboard/tiles", { recursive: true });

  fs.writeFileSync(
    "./dashboard/tiles/spaza-uptime.json",
    JSON.stringify(
      {
        ok: status,
        price,
        error,
        timestamp: Date.now()
      },
      null,
      2
    )
  );
}

// --- Execution ---
async function main() {
  try {
    const rawPrice = await fetchPotatoPrice();

    // Scale to 1e18 for solidity
    const scaled = ethers.parseUnits(String(rawPrice), 18);

    await zartato.updatePrice(scaled);

    console.log("Updated potato price:", rawPrice, "(scaled:", scaled.toString(), ")");

    writeTile(true, rawPrice, null);
  } catch (err) {
    console.error("Oracle error:", err.message);
    writeTile(false, null, err.message);
  }
}

main();