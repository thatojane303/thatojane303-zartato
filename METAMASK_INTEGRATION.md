# MetaMask Integration Guide for ZarTATO

This guide explains how to integrate MetaMask wallet connectivity with the ZarTATO dApp.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Basic Setup](#basic-setup)
3. [Connect MetaMask](#connect-metamask)
4. [Interact with Contracts](#interact-with-contracts)
5. [React Component Example](#react-component-example)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- MetaMask browser extension installed
- Node.js 16+
- Web3.js or Ethers.js library
- ZarTATO contract addresses (Token & Oracle)

---

## Basic Setup

### 1. Install Dependencies

```bash
npm install web3
# OR
npm install ethers
```

### 2. Add MetaMask Detection

Create a file `utils/metamask.js`:

```javascript
/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Get MetaMask provider
 */
export function getMetaMaskProvider() {
  if (isMetaMaskInstalled()) {
    return window.ethereum;
  }
  throw new Error('MetaMask not installed. Please install MetaMask browser extension.');
}
```

---

## Connect MetaMask

### 1. Request Account Access

Create `utils/wallet.js`:

```javascript
import { getMetaMaskProvider } from './metamask';

/**
 * Connect to MetaMask and get user's accounts
 */
export async function connectMetaMask() {
  try {
    const provider = getMetaMaskProvider();
    const accounts = await provider.request({ 
      method: 'eth_requestAccounts' 
    });
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect MetaMask:', error);
    throw error;
  }
}

/**
 * Get currently connected account
 */
export async function getConnectedAccount() {
  try {
    const provider = getMetaMaskProvider();
    const accounts = await provider.request({ 
      method: 'eth_accounts' 
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Failed to get account:', error);
    return null;
  }
}

/**
 * Disconnect wallet (clear session)
 */
export function disconnectWallet() {
  localStorage.removeItem('walletAddress');
  window.location.reload();
}
```

### 2. Network/Chain Configuration

Create `utils/network.js`:

```javascript
import { getMetaMaskProvider } from './metamask';

// BSC Testnet Configuration
export const BSC_TESTNET = {
  chainId: '0x61',      // 97 in hex
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com/']
};

/**
 * Add BSC Testnet to MetaMask
 */
export async function addBSCTestnet() {
  try {
    const provider = getMetaMaskProvider();
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [BSC_TESTNET]
    });
    console.log('BSC Testnet added successfully');
  } catch (error) {
    if (error.code === 4002) {
      console.log('User rejected network addition');
    } else {
      console.error('Failed to add network:', error);
    }
    throw error;
  }
}

/**
 * Switch to BSC Testnet
 */
export async function switchToBSCTestnet() {
  try {
    const provider = getMetaMaskProvider();
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BSC_TESTNET.chainId }]
    });
    console.log('Switched to BSC Testnet');
  } catch (error) {
    if (error.code === 4902) {
      // Network not added, add it first
      await addBSCTestnet();
    } else {
      console.error('Failed to switch network:', error);
    }
    throw error;
  }
}

/**
 * Get current chain ID
 */
export async function getCurrentChainId() {
  try {
    const provider = getMetaMaskProvider();
    const chainId = await provider.request({ 
      method: 'eth_chainId' 
    });
    return chainId;
  } catch (error) {
    console.error('Failed to get chain ID:', error);
    return null;
  }
}
```

---

## Interact with Contracts

### 1. Initialize Contract Instances

Create `utils/contracts.js`:

```javascript
import { ethers } from 'ethers';
import { getMetaMaskProvider } from './metamask';

// Contract ABIs (import from your contract artifacts)
import ZarTATOABI from '../contracts/ZarTATO.json';
import OracleABI from '../contracts/ZarTATOOracle.json';

// Contract Addresses (update these)
export const CONTRACT_ADDRESSES = {
  TOKEN: '0x...',  // Your deployed ZarTATO address
  ORACLE: '0x...' // Your deployed Oracle address
};

/**
 * Get Web3 provider (read-only)
 */
export function getProvider() {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
  );
  return provider;
}

/**
 * Get signer (for transactions)
 */
export async function getSigner() {
  const provider = new ethers.providers.Web3Provider(getMetaMaskProvider());
  return provider.getSigner();
}

/**
 * Get Token contract (read-only)
 */
export function getTokenContract(readOnly = true) {
  if (readOnly) {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESSES.TOKEN, ZarTATOABI, provider);
  } else {
    return getSignedContract('token');
  }
}

/**
 * Get Oracle contract (read-only)
 */
export function getOracleContract(readOnly = true) {
  if (readOnly) {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESSES.ORACLE, OracleABI, provider);
  } else {
    return getSignedContract('oracle');
  }
}

/**
 * Get signed contract instance (for transactions)
 */
async function getSignedContract(type) {
  const signer = await getSigner();
  const abi = type === 'token' ? ZarTATOABI : OracleABI;
  const address = type === 'token' ? CONTRACT_ADDRESSES.TOKEN : CONTRACT_ADDRESSES.ORACLE;
  return new ethers.Contract(address, abi, signer);
}
```

### 2. Token Interactions

Create `utils/token.js`:

```javascript
import { getTokenContract } from './contracts';
import { ethers } from 'ethers';

/**
 * Get token balance
 */
export async function getTokenBalance(address) {
  const contract = getTokenContract(true);
  const balance = await contract.balanceOf(address);
  return ethers.utils.formatEther(balance);
}

/**
 * Get token total supply
 */
export async function getTokenSupply() {
  const contract = getTokenContract(true);
  const supply = await contract.totalSupply();
  return ethers.utils.formatEther(supply);
}

/**
 * Get current price from oracle
 */
export async function getCurrentPrice() {
  const contract = getTokenContract(true);
  try {
    const price = await contract.getPrice();
    // Price is in ZAR cents
    return price.toString();
  } catch (error) {
    console.error('Failed to get price:', error);
    return null;
  }
}

/**
 * Mint tokens (owner only)
 */
export async function mintTokens(amount) {
  const contract = getTokenContract(false);
  try {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.mint(amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Mint failed:', error);
    throw error;
  }
}

/**
 * Burn tokens
 */
export async function burnTokens(amount) {
  const contract = getTokenContract(false);
  try {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.burn(amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Burn failed:', error);
    throw error;
  }
}

/**
 * Approve spending
 */
export async function approveSpending(spender, amount) {
  const contract = getTokenContract(false);
  try {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.approve(spender, amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Approval failed:', error);
    throw error;
  }
}

/**
 * Transfer tokens
 */
export async function transferTokens(recipient, amount) {
  const contract = getTokenContract(false);
  try {
    const amountWei = ethers.utils.parseEther(amount.toString());
    const tx = await contract.transfer(recipient, amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}
```

---

## React Component Example

Create `components/WalletConnect.jsx`:

```jsx
import React, { useState, useEffect } from 'react';
import { connectMetaMask, getConnectedAccount } from '../utils/wallet';
import { switchToBSCTestnet, getCurrentChainId } from '../utils/network';
import { getTokenBalance, getCurrentPrice } from '../utils/token';

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState(null);

  const BSC_TESTNET_CHAIN_ID = '0x61'; // 97 in hex

  useEffect(() => {
    checkConnection();
    setupListeners();
  }, []);

  useEffect(() => {
    if (account) {
      updateBalance();
      updatePrice();
    }
  }, [account]);

  async function checkConnection() {
    const connected = await getConnectedAccount();
    if (connected) {
      setAccount(connected);
      const chain = await getCurrentChainId();
      setChainId(chain);
    }
  }

  function setupListeners() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (newChainId) => {
        setChainId(newChainId);
        window.location.reload();
      });
    }
  }

  async function handleConnect() {
    setLoading(true);
    try {
      const connected = await connectMetaMask();
      setAccount(connected);
      
      // Ensure we're on BSC Testnet
      const chain = await getCurrentChainId();
      if (chain !== BSC_TESTNET_CHAIN_ID) {
        await switchToBSCTestnet();
      }
      
      const chain2 = await getCurrentChainId();
      setChainId(chain2);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function updateBalance() {
    try {
      const bal = await getTokenBalance(account);
      setBalance(bal);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }

  async function updatePrice() {
    try {
      const p = await getCurrentPrice();
      setPrice(p);
    } catch (error) {
      console.error('Failed to fetch price:', error);
    }
  }

  const isCorrectChain = chainId === BSC_TESTNET_CHAIN_ID;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🥔 ZarTATO Wallet Connect</h2>
        
        {!account ? (
          <button 
            onClick={handleConnect} 
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : (
          <div>
            <div style={styles.info}>
              <p><strong>Connected Account:</strong></p>
              <code style={styles.code}>{account}</code>
            </div>

            {!isCorrectChain && (
              <div style={styles.warning}>
                ⚠️ Please switch to BSC Testnet
              </div>
            )}

            <div style={styles.stats}>
              <div>
                <strong>ZRT Balance:</strong>
                <p>{balance} ZRT</p>
              </div>
              <div>
                <strong>Current Price:</strong>
                <p>{price ? `${price} ZAR cents` : 'Loading...'}</p>
              </div>
            </div>

            <button 
              onClick={() => window.location.reload()}
              style={styles.secondaryButton}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#f6851b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  info: {
    marginBottom: '15px'
  },
  code: {
    display: 'block',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '12px',
    wordBreak: 'break-all'
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  warning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
    color: '#856404',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};
```

---

## Event Listeners

Add this to monitor wallet changes:

```javascript
/**
 * Setup MetaMask event listeners
 */
export function setupMetaMaskListeners(callbacks) {
  const provider = getMetaMaskProvider();

  // Account changed
  provider.on('accountsChanged', (accounts) => {
    if (callbacks.onAccountsChanged) {
      callbacks.onAccountsChanged(accounts);
    }
  });

  // Chain/Network changed
  provider.on('chainChanged', (chainId) => {
    if (callbacks.onChainChanged) {
      callbacks.onChainChanged(chainId);
    }
  });

  // Connection
  provider.on('connect', (connectInfo) => {
    if (callbacks.onConnect) {
      callbacks.onConnect(connectInfo);
    }
  });

  // Disconnection
  provider.on('disconnect', (error) => {
    if (callbacks.onDisconnect) {
      callbacks.onDisconnect(error);
    }
  });
}
```

---

## Troubleshooting

### Issue: "MetaMask not installed"
**Solution:** Install MetaMask from https://metamask.io

### Issue: "User rejected connection"
**Solution:** User needs to approve the connection in MetaMask popup

### Issue: "Wrong network"
**Solution:** Use `switchToBSCTestnet()` to switch to BSC Testnet

### Issue: "Insufficient gas"
**Solution:** Fund your wallet with testnet BNB from https://testnet.binance.org/faucet

### Issue: "Contract method not found"
**Solution:** Verify contract ABI and addresses match deployed contracts

---

## Security Best Practices

✅ **DO:**
- Store contract addresses in environment variables
- Validate all user inputs
- Check chain ID before transactions
- Use testnet for development

❌ **DON'T:**
- Hardcode private keys
- Store sensitive data in localStorage
- Allow arbitrary contract interactions
- Use mainnet for testing

---

## Resources

- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Web3.js Docs](https://web3js.readthedocs.io/)
- [BSC Documentation](https://docs.binance.org/)

