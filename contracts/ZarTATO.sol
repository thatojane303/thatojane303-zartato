// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ZarTATO
 * @notice Educational ERC20 token on Base - inspired by BRETT trade-only model
 * @dev Fixed supply 1B, no mint, no farm, no potato backing, no reserves
 * Educational / cultural meme experiment - NOT financial advice
 */
contract ZarTATO is ERC20 {
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10 ** 18;

    constructor() ERC20("ZarTATO", "ZRT") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}