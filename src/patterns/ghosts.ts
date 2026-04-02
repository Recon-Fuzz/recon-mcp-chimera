export const ghostsPattern = {
  name: "ghosts",
  title: "Ghost Variable Tracking Pattern",
  description: `Ghost variables are off-chain state trackers maintained alongside the contract under test.
They mirror expected state changes and enable property comparisons that the contract itself doesn't expose.`,
  explanation: `
## Why Ghost Variables

Many invariants require information the contract doesn't track or expose:
- Cumulative sums (total deposited across all users)
- Historical comparisons (price should never decrease)
- Cross-transaction deltas (balance change == expected change)

Ghost variables solve this by maintaining a parallel bookkeeping system in the test harness.

## Types of Ghost Variables

1. **Accumulators**: Track cumulative sums (total fees, total minted)
2. **Snapshots**: Capture state before an action for before/after comparison
3. **Counters**: Count occurrences (number of liquidations, swaps)
4. **Mappings**: Per-user or per-asset tracking (deposits per user)

## Integration with BeforeAfter

The BeforeAfter pattern is a formalization of ghost snapshots. Before each handler call,
capture relevant state; after the call, compare with expectations.
`,
  codeExample: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Setup} from "./Setup.sol";

abstract contract GhostTracking is Setup {
    // --- Accumulator ghosts ---
    uint256 internal ghost_totalDeposited;
    uint256 internal ghost_totalWithdrawn;
    uint256 internal ghost_totalFees;

    // --- Mapping ghosts ---
    mapping(address => uint256) internal ghost_userDeposits;
    mapping(address => uint256) internal ghost_userWithdrawals;

    // --- Snapshot ghosts ---
    uint256 internal ghost_prevSharePrice;
    uint256 internal ghost_prevTotalSupply;

    // --- Counter ghosts ---
    uint256 internal ghost_depositCount;
    uint256 internal ghost_withdrawCount;
}

abstract contract TargetFunctions is GhostTracking {
    function handler_deposit(uint256 amount) external {
        amount = bound(amount, 1, type(uint128).max);

        // Snapshot before
        ghost_prevTotalSupply = target.totalSupply();
        ghost_prevSharePrice = target.totalSupply() > 0
            ? target.totalAssets() * 1e18 / target.totalSupply()
            : 1e18;

        // Execute
        target.deposit(amount, address(this));

        // Update ghosts
        ghost_totalDeposited += amount;
        ghost_userDeposits[address(this)] += amount;
        ghost_depositCount++;
    }
}

abstract contract Properties is GhostTracking {
    /// @dev Total deposited minus total withdrawn should match contract balance
    function invariant_ghost_accounting() public view returns (bool) {
        uint256 expectedBalance = ghost_totalDeposited - ghost_totalWithdrawn - ghost_totalFees;
        uint256 actualBalance = target.totalAssets();
        return actualBalance >= expectedBalance; // >= to account for yield
    }

    /// @dev Share price should never decrease (tracked via ghost)
    function invariant_share_price_monotonic() public view returns (bool) {
        if (target.totalSupply() == 0) return true;
        uint256 currentPrice = target.totalAssets() * 1e18 / target.totalSupply();
        return currentPrice >= ghost_prevSharePrice;
    }
}`,
};
