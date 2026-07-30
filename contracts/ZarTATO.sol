// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IZarTATOOracle {
    function getPrice() external view returns (uint256);
}

/**
 * @title ZarTATO
 * @notice South African Potato Market Token (ZRT)
 * @dev Reserve-backed ERC-20. 1 ZRT represents 1 x 10kg Grade-1 potato bag.
 *      Minting is capped by physical reserves. Price is read from ZarTATOOracle.
 */
contract ZarTATO is ERC20, Ownable {
    /// @notice Number of 10kg potato bags held in reserve (1 bag = 1 ZRT unit of capacity)
    uint256 public reserveBags;

    /// @notice Oracle that supplies the median potato price (ZAR cents per 10kg bag)
    address public oracle;

    event ReservesUpdated(uint256 newReserveBags);
    event OracleUpdated(address indexed newOracle);
    event Minted(address indexed to, uint256 amount);
    event BurnedFromReserve(address indexed from, uint256 amount);

    constructor(address initialOwner) ERC20("ZarTATO", "ZRT") Ownable(initialOwner) {}

    /**
     * @notice Set the price oracle address
     */
    function setOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "ZarTATO: zero oracle");
        oracle = _oracle;
        emit OracleUpdated(_oracle);
    }

    /**
     * @notice Update physical reserve count (owner / multi-sig)
     * @param newReserveBags New total bags in reserve
     */
    function updateReserves(uint256 newReserveBags) external onlyOwner {
        reserveBags = newReserveBags;
        emit ReservesUpdated(newReserveBags);
    }

    /**
     * @notice Mint tokens up to available reserve capacity
     * @param to Recipient
     * @param amount Amount in wei (18 decimals). 1e18 = 1 bag capacity unit
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "ZarTATO: mint to zero");
        require(totalSupply() + amount <= reserveBags * 1e18, "ZarTATO: exceeds reserves");
        _mint(to, amount);
        emit Minted(to, amount);
    }

    /**
     * @notice Burn tokens from caller and reduce circulating supply
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @notice Burn tokens and optionally reduce reserve accounting
     * @param from Address to burn from (must have allowance if not self)
     * @param amount Amount to burn
     * @param reduceReserves Whether to decrease reserveBags by the equivalent bags
     */
    function burnFromReserve(address from, uint256 amount, bool reduceReserves) external onlyOwner {
        if (from != msg.sender) {
            _spendAllowance(from, msg.sender, amount);
        }
        _burn(from, amount);
        if (reduceReserves) {
            uint256 bags = amount / 1e18;
            if (bags > reserveBags) {
                reserveBags = 0;
            } else {
                reserveBags -= bags;
            }
            emit ReservesUpdated(reserveBags);
        }
        emit BurnedFromReserve(from, amount);
    }

    /**
     * @notice Latest potato price from oracle (ZAR cents per 10kg bag)
     */
    function getPrice() external view returns (uint256) {
        require(oracle != address(0), "ZarTATO: oracle not set");
        return IZarTATOOracle(oracle).getPrice();
    }

    /**
     * @notice Remaining mintable capacity in token units
     */
    function remainingMintCapacity() external view returns (uint256) {
        uint256 cap = reserveBags * 1e18;
        if (totalSupply() >= cap) return 0;
        return cap - totalSupply();
    }
}
