// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZarTATO (ZRT)
 * @dev Fixed-supply ERC-20 community token on Base L2
 *
 * Educational community token with:
 * - Fixed supply: 1,000,000,000 ZRT
 * - No minting, no burning
 * - Price discovery via Aerodrome DEX only
 * - Thandi oracle is informational only (Discord bot display)
 *
 * Disclaimer: Educational experiment. No intrinsic value, no yield promises.
 */

contract ZarTATO is ERC20, Ownable {
    /// @dev Fixed supply: 1 billion tokens at 18 decimals
    uint256 public constant FIXED_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("ZarTATO", "ZRT") Ownable(msg.sender) {
        // Mint full supply to deployer (should be transferred to LP or team vesting)
        _mint(msg.sender, FIXED_SUPPLY);
    }

    /**
     * @dev Prevent any new minting
     * This ensures truly fixed supply
     */
    function mint(address to, uint256 amount) public onlyOwner {
        revert("ZarTATO: minting disabled - fixed supply");
    }

    /**
     * @dev Prevent burning
     * Keeps total supply immutable
     */
    function burn(uint256 amount) public {
        revert("ZarTATO: burning disabled - fixed supply");
    }

    function burnFrom(address account, uint256 amount) public {
        revert("ZarTATO: burning disabled - fixed supply");
    }
}
