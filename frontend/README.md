# ZarTATO dApp

Minimal wallet UI for the ZarTATO (ZRT) fixed-supply token on Base.

## Features

- Connect injected wallet (MetaMask, etc.)
- Switch to **Base Sepolia** or **Base**
- Read `name`, `symbol`, `totalSupply`, `balanceOf` when a real token address is configured
- Honest “not deployed” state while addresses are still zero

## Local

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## After deploy

1. Run `npx hardhat run scripts/deploy.js --network baseSepolia` from the repo root.
2. Put the printed address in:
   - `frontend/src/lib/config.js` (`TOKEN_ADDRESSES[84532]`)
   - and/or `VITE_TOKEN_ADDRESS` in Vercel env / local `.env`
   - `deployments/base-sepolia.json`

## Vercel

Project **root directory** should be `frontend`. Framework: Vite. Build: `npm run build`. Output: `dist`.
