// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IZarTATOOracleFulfill {
    function fulfillRequest(bytes32 requestId, uint256 price) external;
}

/**
 * @title MockFunctionsRouter
 * @notice Local/testnet stand-in for Chainlink Functions router.
 *         Forwards a simulated response to ZarTATOOracle.fulfillRequest.
 */
contract MockFunctionsRouter {
    event MockRequestForwarded(address indexed oracle, bytes32 requestId, uint256 price);

    function simulateFulfill(address oracle, bytes32 requestId, uint256 price) external {
        IZarTATOOracleFulfill(oracle).fulfillRequest(requestId, price);
        emit MockRequestForwarded(oracle, requestId, price);
    }
}
