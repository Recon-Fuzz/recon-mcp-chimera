export const stakingProperties = [
    {
        name: "invariant_reward_rate_consistency",
        description: "The reward rate must remain consistent with the configured emission schedule; no phantom rewards",
        severity: "critical",
        skeleton: `    function invariant_reward_rate_consistency() public view returns (bool) {
        uint256 rewardRate = target.rewardRate();
        uint256 duration = target.rewardsDuration();
        uint256 totalRewards = target.rewardBalance();
        // rewardRate * duration should not exceed total reward pool
        return rewardRate * duration <= totalRewards;
    }`,
    },
    {
        name: "invariant_stake_unstake_conservation",
        description: "Staking and then unstaking the same amount must return the original tokens with no loss or gain (excluding rewards)",
        severity: "critical",
        skeleton: `    function invariant_stake_unstake_conservation() public view returns (bool) {
        // Ghost track: tokens staked == tokens returnable on full unstake
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_reward_distribution_proportionality",
        description: "Rewards must be distributed proportionally to each staker's share of the total staked amount",
        severity: "critical",
        skeleton: `    function invariant_reward_distribution_proportionality() public view returns (bool) {
        uint256 totalStaked = target.totalStaked();
        if (totalStaked == 0) return true;
        // For each actor: earned / totalEarned ~= staked / totalStaked
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_total_staked_matches_sum",
        description: "The total staked amount must equal the sum of all individual stake balances",
        severity: "critical",
        skeleton: `    function invariant_total_staked_matches_sum() public view returns (bool) {
        uint256 sum = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            sum += target.stakeOf(actors[i]);
        }
        return target.totalStaked() == sum;
    }`,
    },
    {
        name: "invariant_no_rewards_without_stake",
        description: "An address with zero staked tokens must not earn any rewards",
        severity: "high",
        skeleton: `    function invariant_no_rewards_without_stake() public view returns (bool) {
        for (uint256 i = 0; i < actors.length; i++) {
            if (target.stakeOf(actors[i]) == 0) {
                if (target.earned(actors[i]) > 0) return false;
            }
        }
        return true;
    }`,
    },
    {
        name: "invariant_reward_pool_solvency",
        description: "The sum of all pending (claimable) rewards must not exceed the reward pool balance",
        severity: "critical",
        skeleton: `    function invariant_reward_pool_solvency() public view returns (bool) {
        uint256 totalPending = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            totalPending += target.earned(actors[i]);
        }
        return totalPending <= target.rewardBalance();
    }`,
    },
    {
        name: "invariant_unstake_does_not_exceed_stake",
        description: "An unstake operation must not withdraw more than the user's staked balance",
        severity: "high",
        skeleton: `    function invariant_unstake_does_not_exceed_stake() public view returns (bool) {
        // Verify in handler: unstake(amount) reverts when amount > stakeOf(caller)
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_claim_resets_earned",
        description: "After claiming rewards, the user's earned amount must be zero (or accrue from the claim timestamp)",
        severity: "medium",
        skeleton: `    function invariant_claim_resets_earned() public view returns (bool) {
        // Verify in handler: after claim, earned(actor) == 0 in same block
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_cooldown_enforced",
        description: "If the staking contract has a cooldown period, unstake must revert before cooldown elapses",
        severity: "high",
        skeleton: `    function invariant_cooldown_enforced() public view returns (bool) {
        // Verify in handler: unstake reverts during cooldown period
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_reward_per_token_monotonic",
        description: "The cumulative rewardPerToken must be monotonically non-decreasing",
        severity: "high",
        skeleton: `    function invariant_reward_per_token_monotonic() public view returns (bool) {
        // Ghost track: rewardPerToken must be >= previous snapshot
        return true; // Implement with ghost variable tracking
    }`,
    },
];
//# sourceMappingURL=staking.js.map