import { ZERO } from "./chains.js";

/**
 * Token addresses per chain. Update after `npx hardhat run scripts/deploy.js`.
 * Env override: VITE_TOKEN_ADDRESS (applies to the selected network).
 */
const envToken = import.meta.env.VITE_TOKEN_ADDRESS || "";

export const TOKEN_ADDRESSES = {
  8453: envToken || ZERO, // Base mainnet
  84532: envToken || ZERO, // Base Sepolia
};

export const DEFAULT_CHAIN_ID = 84532; // prefer testnet until mainnet is live

export function tokenAddressFor(chainId) {
  return TOKEN_ADDRESSES[Number(chainId)] || ZERO;
}
