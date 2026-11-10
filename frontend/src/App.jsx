import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract, formatUnits } from "ethers";
import { ERC20_ABI } from "./lib/abi.js";
import { tokenAddressFor } from "./lib/config.js";
import { CHAINS, ZERO, chainById, explorerTokenUrl, explorerAddressUrl } from "./lib/chains.js";
import {
  connectWallet,
  getAccounts,
  getChainId,
  getProvider,
  hasEthereum,
  shortAddress,
  switchChain,
} from "./lib/wallet.js";

function formatAmount(value, decimals = 18, maxFrac = 4) {
  if (value == null) return "—";
  const n = Number(formatUnits(value, decimals));
  if (!Number.isFinite(n)) return formatUnits(value, decimals);
  return n.toLocaleString(undefined, { maximumFractionDigits: maxFrac });
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [tokenMeta, setTokenMeta] = useState(null);
  const [balance, setBalance] = useState(null);

  const chain = useMemo(() => (chainId != null ? chainById(chainId) : null), [chainId]);
  const tokenAddress = useMemo(() => tokenAddressFor(chainId), [chainId]);
  const tokenDeployed = tokenAddress && tokenAddress !== ZERO;

  const refreshChain = useCallback(async () => {
    try {
      const id = await getChainId();
      setChainId(id);
    } catch {
      /* ignore */
    }
  }, []);

  const loadToken = useCallback(async () => {
    if (!tokenDeployed || chainId == null) {
      setTokenMeta(null);
      setBalance(null);
      return;
    }
    try {
      const provider = await getProvider();
      const contract = new Contract(tokenAddress, ERC20_ABI, provider);
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);
      setTokenMeta({ name, symbol, decimals: Number(decimals), totalSupply });

      if (account) {
        const bal = await contract.balanceOf(account);
        setBalance(bal);
      } else {
        setBalance(null);
      }
    } catch (e) {
      console.error(e);
      setTokenMeta(null);
      setBalance(null);
      setError(e?.shortMessage || e?.message || "Failed to read token");
    }
  }, [account, chainId, tokenAddress, tokenDeployed]);

  useEffect(() => {
    (async () => {
      if (!hasEthereum()) return;
      const accounts = await getAccounts();
      if (accounts[0]) setAccount(accounts[0]);
      await refreshChain();
    })();
  }, [refreshChain]);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  useEffect(() => {
    if (!hasEthereum()) return;
    const onAccounts = (accs) => setAccount(accs?.[0] || null);
    const onChain = (hex) => setChainId(parseInt(hex, 16));
    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccounts);
      window.ethereum.removeListener?.("chainChanged", onChain);
    };
  }, []);

  async function onConnect() {
    setError("");
    setBusy(true);
    try {
      const { address, chainId: id } = await connectWallet();
      setAccount(address);
      setChainId(id);
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Connect failed");
    } finally {
      setBusy(false);
    }
  }

  async function onSwitch(key) {
    setError("");
    setBusy(true);
    try {
      await switchChain(key);
      await refreshChain();
    } catch (e) {
      setError(e?.shortMessage || e?.message || "Network switch failed");
    } finally {
      setBusy(false);
    }
  }

  const wrongNetwork = chainId != null && !chain;

  return (
    <div className="page">
      <header className="top">
        <div className="brand">
          <span className="logo" aria-hidden>
            🥔
          </span>
          <div>
            <h1>ZarTATO</h1>
            <p className="tag">ZRT · Base L2 · fixed supply</p>
          </div>
        </div>
        <div className="actions">
          {account ? (
            <div className="pill account" title={account}>
              {shortAddress(account)}
            </div>
          ) : (
            <button className="btn primary" disabled={busy || !hasEthereum()} onClick={onConnect}>
              {hasEthereum() ? (busy ? "Connecting…" : "Connect wallet") : "Install MetaMask"}
            </button>
          )}
        </div>
      </header>

      <main className="grid">
        <section className="card hero">
          <h2>Educational community token</h2>
          <p>
            Fixed supply of <strong>1,000,000,000 ZRT</strong>. No mint, no burn, no on-chain peg.
            Price discovery only if a market exists (e.g. Aerodrome). Not financial advice.
          </p>
          <div className="badge-row">
            <span className="badge">ERC-20</span>
            <span className="badge">Ownable</span>
            <span className="badge">Solidity 0.8.20</span>
          </div>
        </section>

        <section className="card">
          <h3>Network</h3>
          <p className="muted">
            {chain ? (
              <>
                Connected to <strong>{chain.name}</strong> ({chain.id})
              </>
            ) : wrongNetwork ? (
              <>Unsupported chain ({chainId}). Switch to Base or Base Sepolia.</>
            ) : (
              <>Connect a wallet to detect the network.</>
            )}
          </p>
          <div className="btn-row">
            <button className="btn" disabled={busy} onClick={() => onSwitch("baseSepolia")}>
              Base Sepolia
            </button>
            <button className="btn" disabled={busy} onClick={() => onSwitch("base")}>
              Base
            </button>
          </div>
        </section>

        <section className="card">
          <h3>Token</h3>
          {!tokenDeployed ? (
            <div className="notice">
              <p>
                <strong>Not deployed yet</strong> on this network. Address is still the zero placeholder.
              </p>
              <p className="muted small">
                After deploy, set <code>VITE_TOKEN_ADDRESS</code> or update{" "}
                <code>frontend/src/lib/config.js</code> and <code>deployments/*.json</code>.
              </p>
            </div>
          ) : tokenMeta ? (
            <dl className="stats">
              <div>
                <dt>Name</dt>
                <dd>{tokenMeta.name}</dd>
              </div>
              <div>
                <dt>Symbol</dt>
                <dd>{tokenMeta.symbol}</dd>
              </div>
              <div>
                <dt>Total supply</dt>
                <dd>
                  {formatAmount(tokenMeta.totalSupply, tokenMeta.decimals, 0)} {tokenMeta.symbol}
                </dd>
              </div>
              <div>
                <dt>Your balance</dt>
                <dd>
                  {account
                    ? `${formatAmount(balance, tokenMeta.decimals)} ${tokenMeta.symbol}`
                    : "Connect wallet"}
                </dd>
              </div>
              <div className="wide">
                <dt>Contract</dt>
                <dd className="mono">
                  <a href={explorerTokenUrl(chain, tokenAddress)} target="_blank" rel="noreferrer">
                    {tokenAddress}
                  </a>
                </dd>
              </div>
            </dl>
          ) : (
            <p className="muted">Reading contract…</p>
          )}
        </section>

        <section className="card">
          <h3>Links</h3>
          <ul className="links">
            <li>
              <a href="https://github.com/thatojane303/thatojane303-zartato" target="_blank" rel="noreferrer">
                Source repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/thatojane303/thatojane303-zartato/blob/main/contracts/ZarTATO.sol"
                target="_blank"
                rel="noreferrer"
              >
                ZarTATO.sol
              </a>
            </li>
            {account && chain && (
              <li>
                <a href={explorerAddressUrl(chain, account)} target="_blank" rel="noreferrer">
                  Your address on {chain.explorerName}
                </a>
              </li>
            )}
          </ul>
        </section>

        {error && (
          <section className="card error" role="alert">
            {error}
          </section>
        )}
      </main>

      <footer className="foot">
        <p>
          Educational experiment. No intrinsic value, no yield, no redemption. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
