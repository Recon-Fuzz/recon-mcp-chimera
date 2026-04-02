export const governanceProperties = [
    {
        name: "invariant_vote_weight_conservation",
        description: "Total vote weight across all voters must equal the total voting power supply (no votes created from nothing)",
        severity: "critical",
        skeleton: `    function invariant_vote_weight_conservation() public view returns (bool) {
        uint256 totalWeight = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            totalWeight += target.getVotes(actors[i]);
        }
        return totalWeight <= target.totalVotingPower();
    }`,
    },
    {
        name: "invariant_quorum_monotonicity",
        description: "Quorum threshold must not decrease during an active proposal's voting period",
        severity: "high",
        skeleton: `    function invariant_quorum_monotonicity() public view returns (bool) {
        // Ghost track: quorum at proposal start must remain constant through voting
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_proposal_state_machine",
        description: "Proposals must follow valid state transitions: Pending -> Active -> Succeeded/Defeated -> Queued -> Executed",
        severity: "critical",
        skeleton: `    function invariant_proposal_state_machine() public view returns (bool) {
        // Ghost track: log previous state, verify only valid transitions occur
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_timelock_bounds",
        description: "Execution must only occur after the timelock delay has elapsed and before the grace period expires",
        severity: "critical",
        skeleton: `    function invariant_timelock_bounds() public view returns (bool) {
        // Verify in handler: execute reverts before timelock, succeeds within window
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_no_double_voting",
        description: "An address must not be able to cast votes more than once on the same proposal",
        severity: "critical",
        skeleton: `    function invariant_no_double_voting() public view returns (bool) {
        // Verify in handler: second castVote reverts
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_delegation_conservation",
        description: "Delegating votes must not create or destroy voting power, only transfer it",
        severity: "high",
        skeleton: `    function invariant_delegation_conservation() public view returns (bool) {
        // Track total votes before/after delegation; must remain constant
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_cancelled_proposal_not_executable",
        description: "A cancelled proposal must never transition to Queued or Executed state",
        severity: "high",
        skeleton: `    function invariant_cancelled_proposal_not_executable() public view returns (bool) {
        // Verify in handler: execute/queue revert on cancelled proposals
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_vote_count_consistency",
        description: "forVotes + againstVotes + abstainVotes must equal total votes cast on a proposal",
        severity: "medium",
        skeleton: `    function invariant_vote_count_consistency() public view returns (bool) {
        // For each active proposal, sum vote types and compare to total
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_proposer_threshold",
        description: "Only addresses with voting power >= proposalThreshold can create proposals",
        severity: "high",
        skeleton: `    function invariant_proposer_threshold() public view returns (bool) {
        // Verify in handler: propose reverts when caller has insufficient power
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_executed_proposal_effects",
        description: "An executed proposal's actions must have been applied exactly once",
        severity: "critical",
        skeleton: `    function invariant_executed_proposal_effects() public view returns (bool) {
        // Verify proposal actions were applied (state changes match encoded calls)
        return true; // Implement with handler tracking
    }`,
    },
];
//# sourceMappingURL=governance.js.map