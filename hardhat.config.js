etherscan: {
  apiKey: {
    baseMainnet: process.env.BASESCAN_API_KEY || "",
    baseSepolia: process.env.BASESCAN_API_KEY || "",
  },
  customChains: [
    {
      network: "baseSepolia",
      chainId: 84532,
      urls: {
        apiURL: "https://api-sepolia.basescan.org/api",
        browserURL: "https://sepolia.basescan.org",
      },
    },
    {
      network: "baseMainnet",
      chainId: 8453,
      urls: {
        apiURL: "https://api.basescan.org/api",
        browserURL: "https://basescan.org",
      },
    },
  ],
},