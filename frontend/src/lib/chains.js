/** Base network configs for wallet_addEthereumChain / switch */

export const CHAINS = {
  base: {
    id: 8453,
    hexId: "0x2105",
    name: "Base",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://mainnet.base.org"],
    blockExplorerUrls: ["https://basescan.org"],
    explorerName: "Basescan",
  },
  baseSepolia: {
    id: 84532,
    hexId: "0x14a34",
    name: "Base Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://sepolia.base.org"],
    blockExplorerUrls: ["https://sepolia.basescan.org"],
    explorerName: "Basescan Sepolia",
  },
};

export function chainById(chainId) {
  const id = typeof chainId === "string" ? parseInt(chainId, 16) : Number(chainId);
  return Object.values(CHAINS).find((c) => c.id === id) || null;
}

export function explorerTokenUrl(chain, address) {
  if (!chain || !address || address === ZERO) return null;
  return `${chain.blockExplorerUrls[0]}/token/${address}`;
}

export function explorerAddressUrl(chain, address) {
  if (!chain || !address) return null;
  return `${chain.blockExplorerUrls[0]}/address/${address}`;
}

export const ZERO = "0x0000000000000000000000000000000000000000";
