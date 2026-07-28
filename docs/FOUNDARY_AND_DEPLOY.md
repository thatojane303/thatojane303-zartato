0xD99D1c33F9fC3444f8101754aBC46c52416550D1curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init zartato
# put ZarTATO.sol in src/
forge create --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545/ --private-key YOUR_KEY src/ZarTATO.sol:ZarTATO --chain 97
