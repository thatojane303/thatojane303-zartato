// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZarTATO is ERC20, Ownable {
    uint256 public potatoPrice = 6288; // R62.88 in cents - SA avg Grade 1 10kg
    address public oracle;
    uint256 public constant MAX_SUPPLY = 10000 * 10**18;

    event PriceUpdated(uint256 newPrice);
    event OracleUpdated(address newOracle);

    constructor(address _oracle) ERC20("ZarTATO Potato Token", "ZRT") Ownable(msg.sender) {
        oracle = _oracle;
    }

    function setOracle(address _oracle) external onlyOwner {
        oracle = _oracle;
        emit OracleUpdated(_oracle);
    }

    function setPrice(uint256 _price) external {
        require(msg.sender == oracle || msg.sender == owner(), "not authorized");
        potatoPrice = _price;
        emit PriceUpdated(_price);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "cap exceeded");
        _mint(to, amount);
    }

    // For display: 1 ZRT tracks R62.88 worth of potatoes
    function getValueInZar(uint256 tokenAmount) external view returns (uint256) {
        return (tokenAmount * potatoPrice) / 1e18;
    }
}