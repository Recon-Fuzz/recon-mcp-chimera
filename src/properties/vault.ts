import type { PropertyDef } from "./erc20.js";

export const vaultProperties: PropertyDef[] = [
  {
    name: "invariant_solvency",
    description:
      "The vault's underlying asset balance must always be >= the total shares redeemable value",
    severity: "critical",
    skeleton: `    function invariant_solvency() public view returns (bool) {
        uint256 totalAssets = target.totalAssets();
        uint256 totalSharesValue = target.convertToAssets(target.totalSupply());
        return totalAssets >= totalSharesValue;
    }`,
  },
  {
    name: "invariant_share_price_monotonicity",
    description:
      "The share price (assets per share) must never decrease outside of legitimate loss events",
    severity: "critical",
    skeleton: `    function invariant_share_price_monotonicity() public view returns (bool) {
        if (target.totalSupply() == 0) return true;
        uint256 priceAfter = target.convertToAssets(1e18);
        // Compare with ghost-tracked previous price
        return priceAfter >= _before.totalSupply; // Replace with ghost price tracking
    }`,
  },
  {
    name: "invariant_deposit_withdraw_roundtrip",
    description:
      "Depositing X assets and immediately withdrawing must return <= X assets (no profit from roundtrip)",
    severity: "critical",
    skeleton: `    function invariant_deposit_withdraw_roundtrip() public view returns (bool) {
        // Track deposit amount -> shares received -> redeem shares -> assets returned
        // assets returned must be <= deposit amount
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_no_free_shares",
    description:
      "Shares must never be minted without a corresponding deposit of underlying assets",
    severity: "critical",
    skeleton: `    function invariant_no_free_shares() public view returns (bool) {
        // If totalSupply increased, totalAssets must also have increased
        if (_after.totalSupply > _before.totalSupply) {
            return target.totalAssets() > 0;
        }
        return true;
    }`,
  },
  {
    name: "invariant_total_assets_gte_zero",
    description: "Total assets reported by the vault must never be negative (underflow)",
    severity: "high",
    skeleton: `    function invariant_total_assets_gte_zero() public view returns (bool) {
        return target.totalAssets() >= 0;
    }`,
  },
  {
    name: "invariant_zero_deposit_zero_shares",
    description: "Depositing zero assets must mint zero shares",
    severity: "medium",
    skeleton: `    function invariant_zero_deposit_zero_shares() public view returns (bool) {
        return target.convertToShares(0) == 0;
    }`,
  },
  {
    name: "invariant_withdraw_reduces_total_assets",
    description:
      "After a withdrawal, total assets must decrease by at least the withdrawn amount",
    severity: "high",
    skeleton: `    function invariant_withdraw_reduces_total_assets() public view returns (bool) {
        // Track with BeforeAfter ghost for totalAssets
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_max_withdraw_lte_total_assets",
    description:
      "maxWithdraw for any user must never exceed total assets in the vault",
    severity: "high",
    skeleton: `    function invariant_max_withdraw_lte_total_assets() public view returns (bool) {
        for (uint256 i = 0; i < actors.length; i++) {
            if (target.maxWithdraw(actors[i]) > target.totalAssets()) return false;
        }
        return true;
    }`,
  },
  {
    name: "invariant_preview_matches_actual",
    description:
      "previewDeposit and previewRedeem must match actual deposit/redeem results (within rounding)",
    severity: "medium",
    skeleton: `    function invariant_preview_matches_actual() public view returns (bool) {
        // Compare preview vs actual in handler wrappers
        return true; // Implement with handler tracking
    }`,
  },
  {
    name: "invariant_shares_sum_lte_total_supply",
    description:
      "Sum of all user share balances must equal totalSupply",
    severity: "high",
    skeleton: `    function invariant_shares_sum_lte_total_supply() public view returns (bool) {
        uint256 sum = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            sum += target.balanceOf(actors[i]);
        }
        return sum == target.totalSupply();
    }`,
  },
];
