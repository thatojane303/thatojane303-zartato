// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZarTATOOracle
 * @notice Price feed for South African potato markets (ZAR cents per 10kg Grade-1 bag).
 * @dev Designed for Chainlink Functions integration on BSC Testnet.
 *      - requestPriceUpdate() can be called by owner or automated workflow
 *      - fulfillRequest() / setPrice() writes the aggregated median price
 *      - getPrice() returns the latest stored price
 *
 *      Functions Router (BSC Testnet): 0x6E2dc0F9DB014aE19888F8D5C34D1c5ED1591715
 */
contract ZarTATOOracle is Ownable {
    /// @notice Latest median price in ZAR cents per 10kg bag
    uint256 public latestPrice;

    /// @notice Timestamp of last successful update
    uint256 public lastUpdated;

    /// @notice Optional Chainlink Functions router (for live requests)
    address public functionsRouter;

    /// @notice Chainlink Functions subscription ID
    uint64 public subscriptionId;

    /// @notice Don ID / job configuration placeholder
    bytes32 public donId;

    /// @notice Pending request tracking
    mapping(bytes32 => bool) public pendingRequests;

    event PriceUpdated(uint256 price, uint256 timestamp);
    event PriceRequested(bytes32 indexed requestId);
    event RouterUpdated(address indexed router);
    event SubscriptionUpdated(uint64 subscriptionId);

    constructor(address initialOwner, address _functionsRouter) Ownable(initialOwner) {
        functionsRouter = _functionsRouter;
    }

    function setFunctionsRouter(address _router) external onlyOwner {
        functionsRouter = _router;
        emit RouterUpdated(_router);
    }

    function setSubscriptionId(uint64 _subId) external onlyOwner {
        subscriptionId = _subId;
        emit SubscriptionUpdated(_subId);
    }

    function setDonId(bytes32 _donId) external onlyOwner {
        donId = _donId;
    }

    /**
     * @notice Direct price update (owner, multi-sig, or automation after off-chain aggregation).
     *         Use this on testnet when Chainlink Functions callback is not wired yet.
     */
    function setPrice(uint256 price) external onlyOwner {
        require(price > 0, "ZarTATOOracle: price must be > 0");
        latestPrice = price;
        lastUpdated = block.timestamp;
        emit PriceUpdated(price, block.timestamp);
    }

    /**
     * @notice Callback-style fulfill for Chainlink Functions (or MockFunctionsRouter).
     * @param requestId Request identifier
     * @param price Aggregated median price in ZAR cents
     */
    function fulfillRequest(bytes32 requestId, uint256 price) external {
        require(
            msg.sender == functionsRouter || msg.sender == owner(),
            "ZarTATOOracle: unauthorized fulfiller"
        );
        require(pendingRequests[requestId] || msg.sender == owner(), "ZarTATOOracle: unknown request");
        delete pendingRequests[requestId];
        require(price > 0, "ZarTATOOracle: price must be > 0");
        latestPrice = price;
        lastUpdated = block.timestamp;
        emit PriceUpdated(price, block.timestamp);
    }

    /**
     * @notice Record an outbound price request (for automation / Chainlink Functions).
     * @return requestId Generated request id
     */
    function requestPriceUpdate() external onlyOwner returns (bytes32 requestId) {
        requestId = keccak256(abi.encodePacked(block.timestamp, msg.sender, latestPrice));
        pendingRequests[requestId] = true;
        emit PriceRequested(requestId);
    }

    /**
     * @notice Latest potato price (ZAR cents per 10kg bag)
     */
    function getPrice() external view returns (uint256) {
        require(latestPrice > 0, "ZarTATOOracle: no price yet");
        return latestPrice;
    }
}
