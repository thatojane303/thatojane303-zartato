error CapExceeded();
error InsufficientReserve();
error ZeroAddress();

event ReserveUpdated(uint256 oldReserve, uint256 newReserve);
event AdminBurn(address indexed from, uint256 amount);

constructor(address initialOwner) ERC20("ZarTATO", "ZRT") Ownable2Step() {
    CAP = 100_000_000 * 10 ** decimals();
    // transfer ownership to the requested initial owner
    _transferOwnership(initialOwner);
}

/// @notice Mint tokens. Only owner.
function mint(address to, uint256 amount) external onlyOwner {
    if (to == address(0)) revert ZeroAddress();
    if (totalSupply() + amount > CAP) revert CapExceeded();
    if (reserve < totalSupply() + amount) revert InsufficientReserve();
    _mint(to, amount);
}

/// @notice Burn caller's tokens.
function burn(uint256 amount) external {
    _burn(msg.sender, amount);
}

/// @notice Admin burn: burn tokens from arbitrary address (onlyOwner).
function adminBurn(address from, uint256 amount) external onlyOwner {
    _burn(from, amount);
    emit AdminBurn(from, amount);
}

/// @notice Update the reserve. Only owner.
function updateReserve(uint256 newReserve) external onlyOwner {
    if (newReserve < totalSupply()) revert InsufficientReserve();
    uint256 old = reserve;
    reserve = newReserve;
    emit ReserveUpdated(old, newReserve);
}