// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZarTATO {
    string public name = "ZarTATO";
    string public symbol = "ZRT";
    uint8 public decimals = 18;

    uint256 public totalSupply = 1_000_000_000 ether;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // Price tracking: A‑Grade 10kg potato price in ZAR (or scaled)
    uint256 public potatoPriceZAR;
    address public oracle;

    event PriceUpdated(uint256 newPrice);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(address _oracle) {
        oracle = _oracle;
        balanceOf[msg.sender] = totalSupply;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not authorized");
        _;
    }

    function updatePrice(uint256 _newPrice) external onlyOracle {
        potatoPriceZAR = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    // standard ERC‑20 functions...
}