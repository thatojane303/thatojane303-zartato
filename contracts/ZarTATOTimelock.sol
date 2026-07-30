// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ZarTATOTimelock
 * @notice Queues and executes governance (or multi-sig) transactions after a delay.
 * @dev Only the admin (typically ZarTATOGovernor) may queue/cancel/execute.
 *      Delay protects token holders from instant hostile parameter changes.
 */
contract ZarTATOTimelock {
    uint256 public constant GRACE_PERIOD = 14 days;

    address public admin;
    uint256 public delay;

    mapping(bytes32 => bool) public queued;

    event NewAdmin(address indexed newAdmin);
    event NewDelay(uint256 newDelay);
    event QueueTransaction(bytes32 indexed txHash, address indexed target, uint256 value, bytes data, uint256 eta);
    event CancelTransaction(bytes32 indexed txHash, address indexed target, uint256 value, bytes data, uint256 eta);
    event ExecuteTransaction(bytes32 indexed txHash, address indexed target, uint256 value, bytes data, uint256 eta);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Timelock: not admin");
        _;
    }

    constructor(address admin_, uint256 delay_) {
        require(admin_ != address(0), "Timelock: zero admin");
        require(delay_ >= 1 hours && delay_ <= 30 days, "Timelock: delay out of range");
        admin = admin_;
        delay = delay_;
    }

    receive() external payable {}

    function setAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Timelock: zero admin");
        admin = newAdmin;
        emit NewAdmin(newAdmin);
    }

    function setDelay(uint256 newDelay) external onlyAdmin {
        require(newDelay >= 1 hours && newDelay <= 30 days, "Timelock: delay out of range");
        delay = newDelay;
        emit NewDelay(newDelay);
    }

    function queueTransaction(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 eta
    ) external onlyAdmin returns (bytes32) {
        require(eta >= block.timestamp + delay, "Timelock: eta too early");
        bytes32 txHash = keccak256(abi.encode(target, value, data, eta));
        queued[txHash] = true;
        emit QueueTransaction(txHash, target, value, data, eta);
        return txHash;
    }

    function cancelTransaction(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 eta
    ) external onlyAdmin {
        bytes32 txHash = keccak256(abi.encode(target, value, data, eta));
        queued[txHash] = false;
        emit CancelTransaction(txHash, target, value, data, eta);
    }

    function executeTransaction(
        address target,
        uint256 value,
        bytes calldata data,
        uint256 eta
    ) external onlyAdmin returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(target, value, data, eta));
        require(queued[txHash], "Timelock: not queued");
        require(block.timestamp >= eta, "Timelock: not ready");
        require(block.timestamp <= eta + GRACE_PERIOD, "Timelock: stale");

        queued[txHash] = false;

        (bool ok, bytes memory returndata) = target.call{value: value}(data);
        require(ok, "Timelock: execution failed");

        emit ExecuteTransaction(txHash, target, value, data, eta);
        return returndata;
    }
}
