// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20VotesMinimal {
    function balanceOf(address account) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}

interface IZarTATOTimelock {
    function delay() external view returns (uint256);
    function queueTransaction(address target, uint256 value, bytes calldata data, uint256 eta) external returns (bytes32);
    function executeTransaction(address target, uint256 value, bytes calldata data, uint256 eta) external returns (bytes memory);
    function cancelTransaction(address target, uint256 value, bytes calldata data, uint256 eta) external;
}

/**
 * @title ZarTATOGovernor
 * @notice Token-weighted governance for ZarTATO (ZRT holders).
 * @dev Lifecycle: Propose → Vote → Queue (timelock) → Execute
 *
 *      Voting power = ZRT balance at the time of casting a vote.
 *      (Prototype-friendly; mainnet should migrate to ERC20Votes checkpoints.)
 *
 *      Typical governed actions (via timelock as owner of token/oracle):
 *        - updateReserves
 *        - setOracle
 *        - oracle.setPrice / parameter changes
 *        - transferOwnership of controlled contracts
 */
contract ZarTATOGovernor {
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    struct Proposal {
        address proposer;
        address[] targets;
        uint256[] values;
        bytes[] calldatas;
        string description;
        uint256 startBlock;
        uint256 endBlock;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool canceled;
        bool executed;
        uint256 eta; // timelock eta when queued
    }

    IERC20VotesMinimal public immutable token;
    IZarTATOTimelock public immutable timelock;

    uint256 public votingDelay;       // blocks after proposal before voting starts
    uint256 public votingPeriod;      // blocks voting remains open
    uint256 public proposalThreshold; // min ZRT to propose (wei)
    uint256 public quorumBps;         // quorum as bps of totalSupply (e.g. 1000 = 10%)

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        address[] targets,
        uint256[] values,
        bytes[] calldatas,
        string description,
        uint256 startBlock,
        uint256 endBlock
    );
    event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 weight);
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalQueued(uint256 indexed proposalId, uint256 eta);
    event ProposalExecuted(uint256 indexed proposalId);
    event GovernanceParamsUpdated(uint256 votingDelay, uint256 votingPeriod, uint256 proposalThreshold, uint256 quorumBps);

    constructor(
        address token_,
        address timelock_,
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 proposalThreshold_,
        uint256 quorumBps_
    ) {
        require(token_ != address(0) && timelock_ != address(0), "Gov: zero address");
        require(votingPeriod_ > 0, "Gov: zero voting period");
        require(quorumBps_ > 0 && quorumBps_ <= 10_000, "Gov: bad quorum");
        token = IERC20VotesMinimal(token_);
        timelock = IZarTATOTimelock(timelock_);
        votingDelay = votingDelay_;
        votingPeriod = votingPeriod_;
        proposalThreshold = proposalThreshold_;
        quorumBps = quorumBps_;
    }

    /**
     * @notice Create a proposal. Proposer must hold at least `proposalThreshold` ZRT.
     * @param support encoding: targets[i].call{value: values[i]}(calldatas[i]) after timelock
     */
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) external returns (uint256 proposalId) {
        require(
            token.balanceOf(msg.sender) >= proposalThreshold,
            "Gov: below proposal threshold"
        );
        require(
            targets.length > 0 &&
                targets.length == values.length &&
                targets.length == calldatas.length,
            "Gov: length mismatch"
        );

        proposalId = ++proposalCount;
        uint256 start = block.number + votingDelay;
        uint256 end = start + votingPeriod;

        Proposal storage p = proposals[proposalId];
        p.proposer = msg.sender;
        p.targets = targets;
        p.values = values;
        p.calldatas = calldatas;
        p.description = description;
        p.startBlock = start;
        p.endBlock = end;

        emit ProposalCreated(proposalId, msg.sender, targets, values, calldatas, description, start, end);
    }

    /**
     * @param support 0 = Against, 1 = For, 2 = Abstain
     */
    function castVote(uint256 proposalId, uint8 support) external {
        require(state(proposalId) == ProposalState.Active, "Gov: not active");
        require(support <= 2, "Gov: invalid support");
        require(!hasVoted[proposalId][msg.sender], "Gov: already voted");

        uint256 weight = token.balanceOf(msg.sender);
        require(weight > 0, "Gov: no voting power");

        hasVoted[proposalId][msg.sender] = true;
        Proposal storage p = proposals[proposalId];

        if (support == 0) {
            p.againstVotes += weight;
        } else if (support == 1) {
            p.forVotes += weight;
        } else {
            p.abstainVotes += weight;
        }

        emit VoteCast(msg.sender, proposalId, support, weight);
    }

    function queue(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Succeeded, "Gov: not succeeded");
        Proposal storage p = proposals[proposalId];
        uint256 eta = block.timestamp + timelock.delay();
        p.eta = eta;

        for (uint256 i = 0; i < p.targets.length; i++) {
            timelock.queueTransaction(p.targets[i], p.values[i], p.calldatas[i], eta);
        }

        emit ProposalQueued(proposalId, eta);
    }

    function execute(uint256 proposalId) external {
        require(state(proposalId) == ProposalState.Queued, "Gov: not queued");
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.eta, "Gov: timelock not ready");

        p.executed = true;

        for (uint256 i = 0; i < p.targets.length; i++) {
            timelock.executeTransaction(p.targets[i], p.values[i], p.calldatas[i], p.eta);
        }

        emit ProposalExecuted(proposalId);
    }

    function cancel(uint256 proposalId) external {
        ProposalState s = state(proposalId);
        require(
            s == ProposalState.Pending || s == ProposalState.Active || s == ProposalState.Succeeded,
            "Gov: cannot cancel"
        );
        Proposal storage p = proposals[proposalId];
        require(msg.sender == p.proposer, "Gov: only proposer");
        p.canceled = true;
        emit ProposalCanceled(proposalId);
    }

    function state(uint256 proposalId) public view returns (ProposalState) {
        require(proposalId > 0 && proposalId <= proposalCount, "Gov: invalid id");
        Proposal storage p = proposals[proposalId];

        if (p.canceled) return ProposalState.Canceled;
        if (p.executed) return ProposalState.Executed;
        if (block.number <= p.startBlock) return ProposalState.Pending;
        if (block.number <= p.endBlock) return ProposalState.Active;

        uint256 quorum = (token.totalSupply() * quorumBps) / 10_000;
        if (p.forVotes <= p.againstVotes || p.forVotes + p.abstainVotes < quorum) {
            return ProposalState.Defeated;
        }

        if (p.eta == 0) return ProposalState.Succeeded;
        if (block.timestamp >= p.eta + 14 days) return ProposalState.Expired;
        return ProposalState.Queued;
    }

    /**
     * @notice Update governance parameters. Callable only via a successful proposal
     *         that targets this function through the timelock (timelock must own nothing here;
     *         call this only if governor is configured to accept timelock as trusted —
     *         for simplicity, restricted to proposals executed when msg.sender is timelock).
     */
    function setGovernanceParams(
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 proposalThreshold_,
        uint256 quorumBps_
    ) external {
        require(msg.sender == address(timelock), "Gov: only timelock");
        require(votingPeriod_ > 0, "Gov: zero voting period");
        require(quorumBps_ > 0 && quorumBps_ <= 10_000, "Gov: bad quorum");
        votingDelay = votingDelay_;
        votingPeriod = votingPeriod_;
        proposalThreshold = proposalThreshold_;
        quorumBps = quorumBps_;
        emit GovernanceParamsUpdated(votingDelay_, votingPeriod_, proposalThreshold_, quorumBps_);
    }

    function getActions(uint256 proposalId)
        external
        view
        returns (address[] memory targets, uint256[] memory values, bytes[] memory calldatas)
    {
        Proposal storage p = proposals[proposalId];
        return (p.targets, p.values, p.calldatas);
    }
}
