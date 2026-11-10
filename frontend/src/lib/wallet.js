import { BrowserProvider } from "ethers";
import { CHAINS, chainById } from "./chains.js";

export function hasEthereum() {
  return typeof window !== "undefined" && !!window.ethereum;
}

export async function getProvider() {
  if (!hasEthereum()) throw new Error("No wallet found. Install MetaMask or another injected wallet.");
  return new BrowserProvider(window.ethereum);
}

export async function connectWallet() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  return { provider, signer, address, chainId: Number(network.chainId) };
}

export async function getAccounts() {
  if (!hasEthereum()) return [];
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts || [];
}

export async function getChainId() {
  if (!hasEthereum()) return null;
  const hex = await window.ethereum.request({ method: "eth_chainId" });
  return parseInt(hex, 16);
}

export async function switchChain(key) {
  const chain = CHAINS[key];
  if (!chain) throw new Error(`Unknown chain: ${key}`);
  if (!hasEthereum()) throw new Error("No wallet found");

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chain.hexId }],
    });
  } catch (err) {
    // 4902 = chain not added
    if (err?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chain.hexId,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: chain.rpcUrls,
            blockExplorerUrls: chain.blockExplorerUrls,
          },
        ],
      });
    } else {
      throw err;
    }
  }
  return chain;
}

export function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export { chainById };
