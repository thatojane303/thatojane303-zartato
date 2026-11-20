/**
 * Thandi is a local informational mock only.
 * It does not fetch a live market feed, call a contract, or set a token price.
 */
const fs = require("node:fs");

function fetchReferencePrice() {
  return {
    source: "example-only",
    price: 45.5,
    currency: "ZAR",
    commodity: "A-Grade 10kg potato bag (example)",
    timestamp: Date.now(),
    note: "Mock data for display testing only. ZRT has no peg or redemption value.",
  };
}

function writeDashboardTile(data) {
  fs.mkdirSync("./dashboard/tiles", { recursive: true });
  fs.writeFileSync(
    "./dashboard/tiles/thandi-info.json",
    JSON.stringify({ service: "thandi-mock", status: "example-only", ...data }, null, 2)
  );
  console.log("Mock Thandi tile written:", JSON.stringify(data, null, 2));
}

writeDashboardTile(fetchReferencePrice());
