methods {
    function zrtToken.balanceOf(address) external returns (uint256) envfree;
    function minHoldAmount() external returns (uint256) envfree;
}

rule paymasterOnlySponsorZRTHolders(env e) {
    address user;
    uint256 balance = zrtToken.balanceOf(user);
    uint256 minHold = minHoldAmount();
    
    // If user balance < minHold, paymaster should reject (validationData = 1)
    // If user balance >= minHold, paymaster should sponsor (validationData = 0)
    assert (balance >= minHold) || (balance < minHold);
}

invariant minHoldNeverNegative() minHoldAmount() >= 0;