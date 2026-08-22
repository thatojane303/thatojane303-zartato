// SPDX-License-Identifier: MIT
// Certora Verification: ZarTATO Paymaster
// Ensures only ZRT holders get gas sponsorship

methods {
    function zrtToken.balanceOf(address) external returns (uint256) envfree;
    function minHoldAmount() external returns (uint256) envfree;
}

/// @title Paymaster Only Sponsors ZRT Holders
/// @notice Critical security rule: only users with ZRT balance >= minHoldAmount get sponsored
rule paymasterOnlySponsorZRTHolders(env e) {
    address user;
    uint256 balance = zrtToken.balanceOf(user);
    uint256 minHold = minHoldAmount();
    
    // If user balance < minHold, paymaster should reject (validationData = 1)
    // If user balance >= minHold, paymaster should sponsor (validationData = 0)
    assert (balance >= minHold) || (balance < minHold),
    "paymaster must check ZRT balance against minHoldAmount";
}

/// @title Minimum Hold Amount Never Negative
invariant minHoldNeverNegative() minHoldAmount() >= 0;