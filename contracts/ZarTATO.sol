// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ZarTATO {
    string public name = "ZarTATO";
    string public symbol = "ZRT";
    uint8 public decimals = 18;

    uint256 public totalSupply = 1_000_000_000 ether;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // --- Price Tracking ---
    uint256 public potatoPriceZAR; // A‑Grade 10kg price
    address public oracle;         // musa-bot or Chainlink Functions

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

    // --- ERC20 ---
    function transfer(address to, uint256 value) external returns (bool) {
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Not allowed");
        allowance[from][msg.sender] -= value;
        balanceOf[from] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}