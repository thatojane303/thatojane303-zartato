// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPaymaster} from "@account-abstraction/contracts/interfaces/IPaymaster.sol";
import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZartatoOracle {
    function getMedianPrice() external view returns (uint256 price, uint256 updatedAt);
}

/**
 * @title ZartatoPaymaster - FlexGas for RWA
 * @notice Trust Wallet OnChain mapping: FlexGas + ERC-4337 Bundler/Paymaster + EIP-7702
 */
contract ZartatoPaymaster is IPaymaster {
    IERC20 public immutable zrt;
    IZartatoOracle public immutable oracle;
    address public immutable entryPoint;
    uint256 public constant PRICE_MARKUP_BPS = 11000;
    uint256 public constant STALE_PRICE = 1 hours;

    event Sponsored(address indexed user, uint256 gasCostETH, uint256 zrtCharged);
    error InsufficientZRT();
    error StalePrice();
    error NotEntryPoint();

    constructor(address _zrt, address _oracle, address _entryPoint) {
        zrt = IERC20(_zrt);
        oracle = IZartatoOracle(_oracle);
        entryPoint = _entryPoint;
    }

    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256 maxCost
    ) external override returns (bytes memory context, uint256 validationData) {
        if (msg.sender!= entryPoint) revert NotEntryPoint();
        (uint256 price, uint256 updatedAt) = oracle.getMedianPrice();
        if (block.timestamp - updatedAt > STALE_PRICE) revert StalePrice();
        uint256 requiredZRT = (maxCost * price * PRICE_MARKUP_BPS) / 1e18 / 10000;
        if (zrt.balanceOf(userOp.sender) < requiredZRT) revert InsufficientZRT();
        context = abi.encode(userOp.sender, requiredZRT, maxCost);
        validationData = 0;
    }

    function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external override {
        if (msg.sender!= entryPoint) revert NotEntryPoint();
        if (mode == PostOpMode.postOpReverted) return;
        (address user, uint256 maxZRT,) = abi.decode(context, (address, uint256, uint256));
        (uint256 price,) = oracle.getMedianPrice();
        uint256 actualZRT = (actualGasCost * price * PRICE_MARKUP_BPS) / 1e18 / 10000;
        if (actualZRT > maxZRT) actualZRT = maxZRT;
        emit Sponsored(user, actualGasCost, actualZRT);
    }

    receive() external payable {}
    function getReserve() external view returns (uint256) { return address(this).balance; }
}
