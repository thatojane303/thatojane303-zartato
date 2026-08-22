// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ZarTATOPaymaster - FlexGas compatible gas sponsor for ZRT holders
/// @author Thato Jane - Built for Trust Wallet Smart Contract role
contract ZarTATOPaymaster is BasePaymaster, Ownable {
    IERC20 public immutable zrtToken;
    uint256 public minHoldAmount = 1e18; // 1 ZRT

    constructor(IEntryPoint _entryPoint, address _zrt, address _owner) 
        BasePaymaster(_entryPoint) 
        Ownable(_owner) 
    {
        zrtToken = IERC20(_zrt);
    }

    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32,
        uint256
    ) internal view override returns (bytes memory context, uint256 validationData) {
        address sender = userOp.sender;
        // Sponsor gas if user holds ZRT - Trust Wallet FlexGas logic
        if (zrtToken.balanceOf(sender) >= minHoldAmount) {
            return ("", 0); // Valid, sponsor gas
        }
        return ("", 1); // Invalid, don't sponsor
    }

    function setMinHold(uint256 _amount) external onlyOwner {
        minHoldAmount = _amount;
    }
}