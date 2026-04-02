import type { PropertyDef } from "./erc20.js";

export const lendingProperties: PropertyDef[] = [
  {
    name: "invariant_collateral_ratio_above_minimum",
    description:
      "Every borrower's collateral ratio must remain above the minimum threshold at all times",
    severity: "critical",
    skeleton: `    function invariant_collateral_ratio_above_minimum() public view returns (bool) {
        for (uint256 i = 0; i < actors.length; i++) {
            uint256 debt = target.getBorrowBalance(actors[i]);
            if (debt == 0) continue;
            uint256 collateral = target.getCollateralValue(actors[i]);
            uint256 minRatio = target.minimumCollateralRatio();
            if (collateral * 1e18 / debt < minRatio) return false;
        }
        return true;
    }`,
  },
  {
    name: "invariant_utilization_bounded",
    description:
      "Pool utilization rate must stay within [0, 1e18] (0% to 100%)",
    severity: "critical",
    skeleton: `    function invariant_utilization_bounded() public view returns (bool) {
        uint256 utilization = target.getUtilizationRate();
        return utilization <= 1e18;
    }`,
  },
  {
    name: "invariant_interest_rate_monotonic_with_utilization",
    description:
      "Interest rate must increase monotonically with utilization (no rate inversions)",
    severity: "high",
    skeleton: `    function invariant_interest_rate_monotonic_with_utilization() public view returns (bool) {
        // Ghost track: if utilization increased, rate must not decrease
        return true; // Implement with ghost variable tracking
    }`,
  },
  {
    name: "invariant_liquidation_only_below_health",
    description:
      "Liquidation must only succeed when health factor is below the liquidation threshold",
    severity: "critical",
    skeleton: `    function invariant_liquidation_only_below_health() public view returns (bool) {
        // Verify in handler: liquidation call reverts if health factor >= threshold
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_total_borrows_lte_total_deposits",
    description:
      "Total borrows must never exceed total deposits in any market",
    severity: "critical",
    skeleton: `    function invariant_total_borrows_lte_total_deposits() public view returns (bool) {
        return target.totalBorrows() <= target.totalDeposits();
    }`,
  },
  {
    name: "invariant_repay_reduces_debt",
    description:
      "Repaying a loan must reduce the borrower's debt by at least the repaid amount (minus interest accrued in same block)",
    severity: "high",
    skeleton: `    function invariant_repay_reduces_debt() public view returns (bool) {
        // Track borrow balance before/after repay
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_no_borrowing_without_collateral",
    description:
      "Borrow must revert if the user has no collateral deposited",
    severity: "high",
    skeleton: `    function invariant_no_borrowing_without_collateral() public view returns (bool) {
        // Verify in handler: borrow reverts for zero-collateral users
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_accrued_interest_non_negative",
    description:
      "Accrued interest must always be non-negative (debt can only grow or be repaid)",
    severity: "high",
    skeleton: `    function invariant_accrued_interest_non_negative() public view returns (bool) {
        // Ghost track: debt snapshots must be non-decreasing between repayments
        return true; // Implement with ghost variable tracking
    }`,
  },
  {
    name: "invariant_reserve_factor_applied",
    description:
      "Protocol reserves must grow proportionally to interest collected",
    severity: "medium",
    skeleton: `    function invariant_reserve_factor_applied() public view returns (bool) {
        // Compare reserve growth with interest collected
        return true; // Implement with ghost variable tracking
    }`,
  },
  {
    name: "invariant_flash_loan_no_free_tokens",
    description:
      "Flash loans must repay at least principal + fee; no tokens can be extracted for free",
    severity: "critical",
    skeleton: `    function invariant_flash_loan_no_free_tokens() public view returns (bool) {
        // Track pool balance before/after flash loan; must be >= before + fee
        return true; // Implement with handler tracking
    }`,
  },
];
