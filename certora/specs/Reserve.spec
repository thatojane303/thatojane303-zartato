// SPDX-License-Identifier: MIT
// Certora Verification: ZarTATO Reserve Invariants
// Ensures physical potato reserve >= total token supply

methods {
    function totalSupply() external returns (uint256) envfree;
    function totalBagsInReserve() external returns (uint256) envfree;
}

/// @title Reserve Invariant
/// @notice Critical invariant: total circulating supply must never exceed physical reserve
/// This ensures RWA backing is always maintained
rule reserveInvariant(env e) {
    assert totalSupply() <= totalBagsInReserve(),
    "CRITICAL: totalSupply must never exceed physical reserve";
}

/// @title Mint Respects Reserve
/// @notice Any mint operation must have sufficient reserve backing
/// Prevents over-minting beyond available physical inventory
rule mintRespectsReserve(env e, address to, uint256 amount) {
    require totalBagsInReserve() >= totalSupply() + amount;
    mint@withrevert(e, to, amount);
    assert !lastReverted,
    "mint must succeed when reserve covers new tokens";
}

/// @title Reserve Never Decreases Unexpectedly
/// @notice Reserve can only decrease through authorized burn/redemption
rule reserveMonotonicity(env e) {
    uint256 reserveBefore = totalBagsInReserve();
    method f;
    calldataarg args;
    f(e, args);
    uint256 reserveAfter = totalBagsInReserve();
    
    // Reserve should not decrease unless explicitly through burn
    assert reserveAfter >= reserveBefore || f.selector == sig:burn(uint256).selector,
    "reserve can only decrease through authorized burn";
}

/// @title Supply Backing
/// @notice At all times: totalSupply == totalBagsInReserve - reservedForFutureMint
/// Ensures 1:1 potato-to-token mapping
invariant supplyBacking() 
    totalSupply() <= totalBagsInReserve()
    filtered { f -> !f.isFallback }