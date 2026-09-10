require("@nomicfoundation/hardhat-toolbox");
module.exports = {
  solidity: "0.8.20",
  networks: {
    baseMainnet: { 
      url: process.env.BASE_RPC, 
      chainId: 8453, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] 
    },
    baseSepolia: { 
      url: process.env.BASE_SEPOLIA_RPC, 
      chainId: 84532, 
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] 
    }
  }
};