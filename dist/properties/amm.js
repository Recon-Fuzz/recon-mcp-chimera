export const ammProperties = [
    {
        name: "invariant_constant_product",
        description: "For constant-product AMMs: x * y must never decrease after a swap (k is non-decreasing due to fees)",
        severity: "critical",
        skeleton: `    function invariant_constant_product() public view returns (bool) {
        (uint256 reserve0, uint256 reserve1) = target.getReserves();
        uint256 kAfter = reserve0 * reserve1;
        // Ghost track: kAfter >= kBefore
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_lp_share_proportionality",
        description: "LP shares must be proportional to the liquidity contributed relative to total pool liquidity",
        severity: "critical",
        skeleton: `    function invariant_lp_share_proportionality() public view returns (bool) {
        if (target.totalSupply() == 0) return true;
        // Each LP's share of the pool must reflect their proportion of total LP tokens
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_fee_accounting",
        description: "Collected fees must be fully accounted for: no fees can vanish or be double-counted",
        severity: "high",
        skeleton: `    function invariant_fee_accounting() public view returns (bool) {
        // Ghost track: cumulative fees collected == sum of per-swap fee deductions
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_no_value_extraction",
        description: "No single swap or LP action should extract more value than deposited (arbitrage-free within the pool)",
        severity: "critical",
        skeleton: `    function invariant_no_value_extraction() public view returns (bool) {
        // Track user token deltas across actions
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_reserves_match_balances",
        description: "Tracked reserves must always match actual token balances held by the pool contract",
        severity: "critical",
        skeleton: `    function invariant_reserves_match_balances() public view returns (bool) {
        (uint256 reserve0, uint256 reserve1) = target.getReserves();
        uint256 balance0 = token0.balanceOf(address(target));
        uint256 balance1 = token1.balanceOf(address(target));
        return reserve0 <= balance0 && reserve1 <= balance1;
    }`,
    },
    {
        name: "invariant_swap_output_lte_reserves",
        description: "The output amount of a swap must never exceed the reserve of the output token",
        severity: "high",
        skeleton: `    function invariant_swap_output_lte_reserves() public view returns (bool) {
        // Verify in handler: swap output < reserve of output token
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_add_liquidity_increases_k",
        description: "Adding liquidity must increase the invariant (k) or keep it the same",
        severity: "high",
        skeleton: `    function invariant_add_liquidity_increases_k() public view returns (bool) {
        // Ghost track: k after addLiquidity >= k before
        return true; // Implement with ghost variable tracking
    }`,
    },
    {
        name: "invariant_remove_liquidity_proportional",
        description: "Removing liquidity must return both tokens proportionally to the LP share burned",
        severity: "high",
        skeleton: `    function invariant_remove_liquidity_proportional() public view returns (bool) {
        // Track: amount0 / reserve0 ~= amount1 / reserve1 ~= sharesBurned / totalSupply
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_price_impact_bounded",
        description: "Price impact of any single swap should be bounded by the swap amount relative to reserves",
        severity: "medium",
        skeleton: `    function invariant_price_impact_bounded() public view returns (bool) {
        // Verify large swaps don't cause disproportionate price movement
        return true; // Implement with handler tracking
    }`,
    },
    {
        name: "invariant_zero_liquidity_no_swap",
        description: "Swaps must revert when either reserve is zero",
        severity: "high",
        skeleton: `    function invariant_zero_liquidity_no_swap() public view returns (bool) {
        // Verify in handler: swap reverts if reserves are zero
        return true; // Implement with handler tracking
    }`,
    },
];
//# sourceMappingURL=amm.js.map