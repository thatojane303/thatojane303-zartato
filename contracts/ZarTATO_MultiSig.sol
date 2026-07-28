// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * ZarTATO Multi-Sig Ownership Module
 * - N-of-M signers required
 * - Queue + execute pattern
 * - Time-locked executions
 */
contract ZarTATO_MultiSig {
    address[] public signers;
    mapping(address => bool) public isSigner;
    uint256 public required;
    uint256 public txCount;
    uint256 public timelock = 2 days;

    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        uint256 timestamp; // earliest execution time
        uint256 confirmCount;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    event Submit(uint256 indexed txId, address indexed proposer, address destination, uint256 value, bytes data, uint256 readyAt);
    event Confirm(address indexed signer, uint256 indexed txId);
    event Execute(uint256 indexed txId);

    constructor(address[] memory _signers, uint256 _required) {
        require(_signers.length > 0, "ZMS: no signers");
        require(_required > 0 && _required <= _signers.length, "ZMS: invalid required");
        for (uint i = 0; i < _signers.length; i++) {
            address s = _signers[i];
            require(s != address(0), "ZMS: zero signer");
            require(!isSigner[s], "ZMS: duplicate signer");
            isSigner[s] = true;
            signers.push(s);
        }
        required = _required;
    }

    modifier onlySigner() {
        require(isSigner[msg.sender], "ZMS: not signer");
        _;
    }

    /// @notice Submit a transaction to the multisig. Returns the txId.
    function submitTransaction(address destination, uint256 value, bytes calldata data) external onlySigner returns (uint256) {
        uint256 txId = txCount;
        transactions[txId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false,
            timestamp: block.timestamp + timelock,
            confirmCount: 0
        });
        txCount = txCount + 1;

        emit Submit(txId, msg.sender, destination, value, data, transactions[txId].timestamp);
        return txId;
    }

    /// @notice Confirm a queued transaction. If confirmations reach `required` and the timelock has passed, it executes immediately.
    function confirmTransaction(uint256 txId) external onlySigner {
        Transaction storage txn = transactions[txId];
        require(txn.destination != address(0), "ZMS: tx not found");
        require(!txn.executed, "ZMS: already executed");
        require(!isConfirmed[txId][msg.sender], "ZMS: already confirmed");

        isConfirmed[txId][msg.sender] = true;
        txn.confirmCount = txn.confirmCount + 1;

        emit Confirm(msg.sender, txId);

        if (txn.confirmCount >= required && block.timestamp >= txn.timestamp) {
            _executeTransaction(txId);
        }
    }

    function _executeTransaction(uint256 txId) internal {
        Transaction storage txn = transactions[txId];
        require(!txn.executed, "ZMS: already executed");
        txn.executed = true;
        (bool success, ) = txn.destination.call{value: txn.value}(txn.data);
        require(success, "ZMS: tx failed");
        emit Execute(txId);
    }

    /// @notice Allows the contract to receive ETH for future transactions or to hold value.
    receive() external payable {}
    fallback() external payable {}
}
